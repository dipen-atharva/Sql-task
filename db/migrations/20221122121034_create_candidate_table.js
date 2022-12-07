/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('candidates', (t) => {
    t.increments('id').primary();
    // t.bigint('wp_post_id');
    // t.string('wp_applied_for');
    // t.string('wp_first_name');
    // t.string('wp_last_name');
    // t.text('wp_email');
    t.timestamp('discarded_at');
    // t.timestamp('wp_created_at');
    // t.timestamp('wp_updated_at');
    t.string('tittle');
    t.string('emails');
    t.text('address');
    t.string('country');
    // t.string('wp_mobilephone');
    t.string('telephone');
    t.string('skypeid');
    t.string('linkedinid');
    t.string('description');
    // t.string('wp_agree_privacy_policy');
    // t.text('wp_cover_letter');
    t.integer('status_code');
    t.integer('preferrred_contact_method_code');
    t.integer('initial_communication');
    t.text('tech_stack_ids');
    t.integer('source_code');
    t.bigint('assignee_id');
    t.bigint('reporter_id');
    t.bigint('created_by_id');
    t.bigint('updated_by_id');
    t.bigint('company_id');
    // t.text('wp_post_meta_data');
    // t.text('wp_application_mails');
  });
};


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTable("candidates")
};
