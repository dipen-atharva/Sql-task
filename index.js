require('dotenv').config()
const { sourceKnex, destKnex } = require('./db/knex');
let rowLimit = 5;

const insert = async () => {

  const mxCrtdDt = await destKnex('candidates').max('wp_created_at', { as: 'mxD' })
  if (!mxCrtdDt[0].mxD) {
    console.log("inside if block")
    mxCrtdDt[0].mxD = 0;
  }

  const totalRecords = await sourceKnex('wp_posts')
      .where({ post_type: "awsm_job_application" })
      .where('post_date', '>', mxCrtdDt[0].mxD)
      .count('id', {as: 'ttlRec'})

  console.log("---+++++++++++++++-INSERT QUERY--+++++++++++++++--", totalRecords, "---", mxCrtdDt[0].mxD)
  
  let wpPosts = [];
  for (let skipRows = 0; skipRows < totalRecords[0].ttlRec;) {
    console.log("---+++++++++++++++-INSERT QUERY--+++++++++++skipRows++++--", skipRows)
    wpPosts.push(sourceKnex('wp_posts')
      .where({ post_type: "awsm_job_application" })
      .where('post_date', '>', mxCrtdDt[0].mxD)
      .select('ID', 'post_date', 'post_modified')
      .limit(rowLimit)
      .offset(skipRows)
      .then((postData) => {
        return Promise.all(
          postData.map(async (post) => {
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
    skipRows += rowLimit
  }
  return(Promise.all(wpPosts))
}


// await destKnex('candidates').max('wp_updated_at', { as: 'mxD' })
// .then((date) => {
//   console.log("----UPDATE QUERY----", totalRecords, date[0].mxD)
//   for (let skipRows = 0; skipRows < totalRecords[0].ttlRec;) {
//     // skipRows += rowLimit;
//      sourceKnex('wp_posts')
//       .select('ID', 'post_date', 'post_modified')
//       .where({
//         post_type: "awsm_job_application"
//       })
//       .where('post_modified', '>', date[0].mxD)
//       .limit(rowLimit)
//       .offset(skipRows)
//       .then((ID) => {
//         // console.log("+++++++++++++++++++++++++++++++")
//         console.log(skipRows, "---")
//         for (let id of ID) {
//           console.log("Last Update :- ", date[0].mxD)
//           console.log(id.ID)
//           return sourceKnex('wp_postmeta')
//             .where({
//               post_id: id.ID
//             })
//             .select('*')
//             .then((row) => {
//               let result = new Map();
//               row.map(function (element) {
//                 return result.set(element.meta_key, element.meta_value)
//               })
//               console.log(Object.fromEntries(result));
//               return destKnex('candidates').where({ wp_post_id: id.ID }).update({
//                 wp_post_id: id.ID,
//                 wp_applied_for: result.get('awsm_apply_for'),
//                 wp_first_name: result.get('awsm_applicant_name').split(" ", 1).toString(),
//                 wp_last_name: result.get('awsm_applicant_name').split(" ").pop(),
//                 wp_email: result.get('awsm_applicant_email'),
//                 wp_mobilephone: result.get('awsm_applicant_phone'),
//                 wp_cover_letter: result.get('awsm_applicant_letter'),
//                 wp_agree_privacy_policy: result.get('awsm_agree_privacy_policy'),
//                 wp_application_mails: result.get('awsm_application_mails'),
//                 wp_updated_at: id.post_modified,
//                 wp_post_meta_data: JSON.stringify({
//                   wp_post_id: id.ID,
//                   meta_data: Object.fromEntries(result),
//                 })
//               }).then(() => {
//                 return console.log("data updated")
//               })
//             }).catch(function (err) {
//               console.error(err);
//             });
//         }
//       }).catch(function (err) {
//         console.error(err);
//       });
//     skipRows += rowLimit;
//   }
// })


const run = async () => {
  try {
    await insert()
    process.exit(0)
  } catch (err) {
    console.error(err)
    process.exit(1);
  }
};

run();




