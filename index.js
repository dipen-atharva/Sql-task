require('dotenv').config()
const { sourceKnex, destKnex } = require('./db/knex');
const rowLimit = 5;

const insert = async () => {

  const mxCrtdDt = await destKnex('candidates').max('wp_created_at', { as: 'mxD' })
  if (!mxCrtdDt[0].mxD) {
    console.log("inside if block")
    mxCrtdDt[0].mxD = 0;
  }
  // await destKnex.raw("set time zone 'utc'");
  console.log("---+++++++++++++++-INSERT QUERY--+++++++++++++++--", "---", mxCrtdDt[0].mxD)
  let wpPosts = [];
  let start = 0;
  let decide = true;

  while (decide) {
    console.log("---+++++++++++++++-START-+++++++++++++++--", start)
    wpPosts.push(await sourceKnex('wp_posts')
      .where('wp_posts.post_type', '=', "awsm_job_application")
      .where('wp_posts.post_date', '>', mxCrtdDt[0].mxD)
      .limit(rowLimit)
      .offset(start)
      .then((sourcePostData) => {
        if (sourcePostData.length !== rowLimit) {
          console.log(sourcePostData.length, "-----INCOMPLETE-----");
          decide = false;
        }
        return Promise.all(
          sourcePostData.map(async (post) => {
            console.log(post.ID, "++++++++++++++++++++");
            const sourceMetaData = await sourceKnex('wp_postmeta').where({
              post_id: post.ID
            })
            let result = new Map();
            sourceMetaData.map(function (element) {
              return result.set(element.meta_key, element.meta_value);
            });
            const destCandidates = await destKnex('candidates')
              .select()
              .where({
                'wp_post_id': post.ID,
              })
            if (destCandidates.length === 0) {
              await destKnex('candidates').insert({
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
              })
              console.log("+++++Data added", post.ID)
            } else {
              console.log("+++++Already added", post.ID)
            }
          })
        )
      })
    )
    start += rowLimit;
  }
  return (Promise.all(wpPosts))
}

const update = async () => {

  const mxUpdtDt = await destKnex('candidates').max('wp_updated_at', { as: 'mxD' })
  console.log("---+++++++++++++++-UPDATE QUERY--+++++++++++++++--", mxUpdtDt[0].mxD)
  let wpPosts = [];
  let start = 0;
  let decide = true;

  while (decide) {
    wpPosts.push(await sourceKnex('wp_posts')
      .select('ID', 'post_date', 'post_modified')
      .where({ post_type: "awsm_job_application" })
      .where('post_modified', '>', mxUpdtDt[0].mxD)
      .limit(rowLimit)
      .offset(start)
      .then((data) => {

        if (data.length !== rowLimit) {
          console.log(data.length, "-----INCOMPLETE Update  -----");
          decide = false;
        }
        return Promise.all(
          data.map(async (id) => {

            const sourcePostMeta = await sourceKnex('wp_postmeta')
              .where({ post_id: id.ID })
              .select('*')

            let result = new Map();
            sourcePostMeta.map(function (element) {
              return result.set(element.meta_key, element.meta_value)
            })
            // console.log(id.ID)
            // console.log(Object.fromEntries(result));

            const updtCandidates = await destKnex('candidates')
              .where({ wp_post_id: id.ID })
              .update({
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
              })
            console.log("data updated")
          })
        )
      })
    )
    start += rowLimit;
  }
  return (Promise.all(wpPosts))
}

const run = async () => {
  try {
    await insert()
    await update()
    process.exit(0)
  } catch (err) {
    console.error(err)
    process.exit(1);
  }
};

run();




