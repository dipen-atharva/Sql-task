require('dotenv').config()
const { sourceKnex, destKnex } = require('./db/knex');
const rowLimit = 10;
let end = rowLimit - 1;

const insert = async () => {

  const mxCrtdDt = await destKnex('candidates').max('wp_created_at', { as: 'mxD' })
  if (!mxCrtdDt[0].mxD) {
    console.log("inside if block")
    mxCrtdDt[0].mxD = 0;
  }
  console.log("---+++++++++++++++-INSERT QUERY--+++++++++++++++--", "---", mxCrtdDt[0].mxD)
  let wpPosts = [];
  let records = [];
  for (let start = 0; start < end;) {
    console.log("---+++++++++++++++-START--END--+++++++++++++++--", start, end)

    if (records.length == 0) {
      // console.log("Pass");
    }
    else if (records[0] !== rowLimit){
      console.log("Break");
      break;
    }
    console.log(records)

    wpPosts.push(await sourceKnex('wp_posts')
      // .join('wp_postmeta', 'wp_posts.ID', '=', 'wp_postmeta.post_id')
      .where('wp_posts.post_type', '=', "awsm_job_application")
      .where('wp_posts.post_date', '>', mxCrtdDt[0].mxD)
      // .select("wp_posts.ID", 'wp_postmeta.meta_key')
      .limit(rowLimit)
      .offset(start)
      .then((sourcePostData) => {

        if (sourcePostData.length !== rowLimit) {
          console.log(sourcePostData.length, "-----INCOMPLETE-----");
          records.push(sourcePostData.length)
        } else {
          console.log(sourcePostData.length);
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
              // await destKnex('candidates').insert({
              //   wp_post_id: post.ID,
              //   wp_applied_for: result.get('awsm_apply_for'),
              //   wp_first_name: result.get('awsm_applicant_name').split(" ", 1).toString(),
              //   wp_last_name: result.get('awsm_applicant_name').split(" ").pop(),
              //   wp_email: result.get('awsm_applicant_email'),
              //   wp_mobilephone: result.get('awsm_applicant_phone'),
              //   wp_cover_letter: result.get('awsm_applicant_letter'),
              //   wp_agree_privacy_policy: result.get('awsm_agree_privacy_policy'),
              //   wp_application_mails: result.get('awsm_application_mails'),
              //   wp_created_at: post.post_date,
              //   wp_updated_at: post.post_modified,
              //   wp_post_meta_data: JSON.stringify({
              //     wp_post_id: post.ID,
              //     meta_data: Object.fromEntries(result)
              //   })
              // })
              console.log("+++++Data added", post.ID)
            } else {
              console.log("+++++Already added", post.ID)
            }
          })
        )
      })
    )
    start += rowLimit;
    end += rowLimit;
  }
  return (Promise.all(wpPosts))
}

// await destKnex('candidates').max('wp_updated_at', { as: 'mxD' })
// .then((date) => {
//   console.log("----UPDATE QUERY----", totalRecords, date[0].mxD)
//   for (let start = 0; start < totalRecords[0].ttlRec;) {
//     // start += rowLimit;
//      sourceKnex('wp_posts')
//       .select('ID', 'post_date', 'post_modified')
//       .where({
//         post_type: "awsm_job_application"
//       })
//       .where('post_modified', '>', date[0].mxD)
//       .limit(rowLimit)
//       .offset(start)
//       .then((ID) => {
//         // console.log("+++++++++++++++++++++++++++++++")
//         console.log(start, "---")
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
//     start += rowLimit;
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




