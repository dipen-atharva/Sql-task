require('dotenv').config()

const { sourceKnex, destKnex } = require('./db/knex');
let row_Limit = 5;
let totalRecords = [];

async function run() {
    await sourceKnex('wp_posts')
      .where({ post_type: "awsm_job_application" })
      .count('post_type as ttl_Rec')
      .then((result) => {
        result.forEach((value) => totalRecords.push(value))

        return destKnex('candidates').max('wp_created_at', { as: 'mxD' })
          .then((date) => {
            console.log("----INSERT QUERY----", totalRecords, date[0].mxD)
            // if max date is null
            if (!date[0].mxD) {
              date[0].mxD = 0;
            }
            for (let skipRows = 0; skipRows < totalRecords[0].ttl_Rec;) {

              sourceKnex('wp_posts')
                .where({ post_type: "awsm_job_application" })
                .where('post_date', '>', date[0].mxD)
                // .where({post_date : null})
                .select('ID', 'post_date', 'post_modified')
                .limit(row_Limit)
                .offset(skipRows)
                .then((postData) => {
                  console.log(skipRows, "----SKIPPED ROWS----")
                  for (let post of postData) {
                    console.log(post)

                    sourceKnex('wp_postmeta').where({
                      post_id: post.ID
                    }).select('*')
                      .then((row) => {
                        let result = new Map();
                        row.map(function (element) {
                          return result.set(element.meta_key, element.meta_value)
                        })

                        destKnex('candidates')
                          .select()
                          .where({
                            'wp_post_id': post.ID,
                          })
                          .then(function (rows, err) {
                            if (rows.length === 0) {
                              // no matching records foun

                              destKnex('candidates').insert({
                                wp_post_id: post.ID,
                                wp_applied_for: result.get('awsm_apply_for'),
                                wp_first_name: result.get('awsm_applicant_name').split(" ", 1).toString(),
                                wp_last_name: result.get('awsm_applicant_name').split(" ").pop(),
                                wp_email: result.get('awsm_applicant_email'),
                                wp_mobilephone: result.get('awsm_applicant_phone'),
                                wp_cover_letter: result.get('awsm_applicant_letter'),
                                wp_agree_privacy_policy: result.get('awsm_agree_privacy_policy'),
                                wp_application_mails: result.get('awsm_application_mails'),
                                wp_created_at: post.post_date,
                                wp_updated_at: post.post_modified,
                                wp_post_meta_data: JSON.stringify({
                                  wp_post_id: post.ID,
                                  meta_data: Object.fromEntries(result)
                                })
                              }).then(() => {
                                return console.log("data added")
                              })
                            } else {
                              throw err
                            }
                          }).catch((err) => {
                            // if (err) { throw err } else console.log("Duplicate data entry detected")
                          })
                      }).catch(function (err) {
                        console.error(err);
                      });
                  }
                }).catch(function (err) {
                  console.error(err);
                })
              skipRows += row_Limit
            }
          })
      })


      await destKnex('candidates').max('wp_updated_at', { as: 'mxD' })
        .then((date) => {
          console.log("----UPDATE QUERY----", totalRecords, date[0].mxD)
          for (let skipRows = 0; skipRows < totalRecords[0].ttl_Rec;) {
            // skipRows += row_Limit;
             sourceKnex('wp_posts')
              .select('ID', 'post_date', 'post_modified')
              .where({
                post_type: "awsm_job_application"
              })
              .where('post_modified', '>', date[0].mxD)
              .limit(row_Limit)
              .offset(skipRows)
              .then((ID) => {
                // console.log("+++++++++++++++++++++++++++++++")
                console.log(skipRows, "---")
                for (let id of ID) {
                  console.log("Last Update :- ", date[0].mxD)
                  console.log(id.ID)
                  return sourceKnex('wp_postmeta')
                    .where({
                      post_id: id.ID
                    })
                    .select('*')
                    .then((row) => {
                      let result = new Map();
                      row.map(function (element) {
                        return result.set(element.meta_key, element.meta_value)
                      })
                      console.log(Object.fromEntries(result));
                      return destKnex('candidates').where({ wp_post_id: id.ID }).update({
                        wp_post_id: id.ID,
                        wp_applied_for: result.get('awsm_apply_for'),
                        wp_first_name: result.get('awsm_applicant_name').split(" ", 1).toString(),
                        wp_last_name: result.get('awsm_applicant_name').split(" ").pop(),
                        wp_email: result.get('awsm_applicant_email'),
                        wp_mobilephone: result.get('awsm_applicant_phone'),
                        wp_cover_letter: result.get('awsm_applicant_letter'),
                        wp_agree_privacy_policy: result.get('awsm_agree_privacy_policy'),
                        wp_application_mails: result.get('awsm_application_mails'),
                        wp_updated_at: id.post_modified,
                        wp_post_meta_data: JSON.stringify({
                          wp_post_id: id.ID,
                          meta_data: Object.fromEntries(result),
                        })
                      }).then(() => {
                        return console.log("data updated")
                      })
                    }).catch(function (err) {
                      console.error(err);
                    });
                }
              }).catch(function (err) {
                console.error(err);
              });
            skipRows += row_Limit;
          }
        })

}


run()
  .then(() => {
    console.log('exit', "++++++++++++");
    // setTimeout(()=> {process.exit(0)},10000);
    // process.exit(0)
  })
  .catch((e) => {
    console.error("[ERROR]", e)
    process.exit(1);
  })











