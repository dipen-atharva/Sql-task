require('dotenv').config()

const { sourceKnex, destKnex } = require('./db/knex');

sourceKnex('wp_posts').where({
  post_type: "awsm_job_application"
}).select('ID', 'post_date', 'post_modified')
  .then((postData) => {

    for (let post of postData) {
      sourceKnex('wp_postmeta').where({
        post_id: post.ID
      }).select('*')
        .then((row) => {
          var result = new Map();
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
                // no matching records found
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
                  wp_post_meta_data: {
                    wp_post_id: post.ID,
                    meta_data: Object.fromEntries(result)
                  }
                }).then(() => { return console.log("data added") })
              } else {
                throw err
              }
            })
            .catch(() => {
              console.log("Duplicate data entry detected")
            })

          // UPDATE
          // destKnex('candidates')
          //   .select()
          //   .where(('wp_updated_at', '>', post.post_date))
          //   .then(function (rows, err) {
          //     // if (rows.length === 0) {
          //       // no matching records found
          //       console.log(rows)
          //       destKnex('candidates').update({
          //         wp_post_id: post.ID,
          //         wp_applied_for: result.get('awsm_apply_for'),
          //         wp_first_name: result.get('awsm_applicant_name').split(" ", 1).toString(),
          //         wp_last_name: result.get('awsm_applicant_name').split(" ").pop(),
          //         wp_email: result.get('awsm_applicant_email'),
          //         wp_mobilephone: result.get('awsm_applicant_phone'),
          //         wp_cover_letter: result.get('awsm_applicant_letter'),
          //         wp_agree_privacy_policy: result.get('awsm_agree_privacy_policy'),
          //         wp_application_mails: result.get('awsm_application_mails'),
          //         wp_created_at: post.post_date,
          //         wp_updated_at: post.post_modified,
          //         wp_post_meta_data: {
          //           wp_post_id: post.ID,
          //           // meta_data: Object.fromEntries(result)
          //         }
          //       }).then(() => { return console.log("data updated") })
          //     // } else {
          //     //   throw err
          //     // }
          //   })
          //   .catch(() => {
          //     console.log("Unknown Error")
          //   })
        })
        .catch(function (err) {
          console.error(err);
        });
    }
  })
  .catch(function (err) {
    console.error(err);
  })








