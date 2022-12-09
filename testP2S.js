require('dotenv').config()
const { sourceKnex, destKnex } = require('./db/knex');

const insert = async () => {

  const crtdAT = await destKnex('candidates')
    .select('wp_created_at', 'wp_post_id')
    .where({ 'wp_post_id': 9976 })

  console.log(crtdAT[0].wp_post_id, crtdAT[0].wp_created_at)
  const sqlDate = await sourceKnex('wp_posts')
    .select('ID', 'post_date')
    .where('wp_posts.post_type', '=', "awsm_job_application")
    .where({
      'ID': 9976,
    })
  console.log(sqlDate)
  // let utc = new Date(crtdAT[0].wp_created_at) ;
  // console.log(utc)
  const final = await sourceKnex('wp_posts').update({
    post_date: crtdAT[0].wp_created_at
  }).where({
    'ID': 9976,
  })

}

const run = async () => {
  try {
    await insert()
    // await update()
    process.exit(0)
  } catch (err) {
    console.error(err)
    process.exit(1);
  }
};

run();
