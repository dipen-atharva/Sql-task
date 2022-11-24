require('dotenv').config()

const { sourceKnex, destKnex } = require('./db/knex');

const func = async () => {
  await sourceKnex('wp_posts').where({
    post_type: "awsm_job_application"
  }).select('ID')
    .then((postData) => {
      for (var post of postData) {
        sourceKnex('wp_postmeta').where({
          post_id: post.ID
        }).select('*')
          .then((row) => {
            var result = new Map();
            row.map(function (element) {
              return result.set(element.meta_key, element.meta_value)
            })
            var first_name = result.get('awsm_applicant_name').split(" ", 1).toString();
            var last_name = result.get('awsm_applicant_name').split(" ").pop();
            return destKnex('candidates')
              .select()
              .where({
                'wp_post_id': result.get('awsm_job_id'),
              })
              .then(function (rows, err) {

                if (rows.length === 0) {
                  // no matching records found
                  return destKnex('candidates').insert({
                    wp_post_id: result.get('awsm_job_id'),
                    applied_for: result.get('awsm_apply_for'),
                    first_name: first_name,
                    last_name: last_name,
                    email: result.get('awsm_applicant_email'),
                    mobilephone: result.get('awsm_applicant_phone'),
                    cover_letter: result.get('awsm_applicant_letter'),
                    agree_privacy_policy: result.get('awsm_agree_privacy_policy'),
                    application_mails: result.get('awsm_application_mails'),
                    wp_post_meta_data: { meta_data: Object.fromEntries(result) }
                  }).then(() => { return console.log("data added") })
                } else {
                  throw err
                }
              })
              .catch((err) => {
                if (err) { throw err } else console.log("Duplicate data entry detected")
              })
          })
          .catch(function (err) {
            console.error(err);
          });
      }
    })
    .catch(function (err) {
      console.error(err);
    })

}

func();







