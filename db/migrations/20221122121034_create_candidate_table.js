/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('candidates', function (t) {
    t.increments('id').primary();
    t.integer('wp_post_id', 45);
    t.text('wp_post_meta_data', 500);
    t.string('applied_for', 100);
    t.string('first_name', 45);
    t.string('last_name', 45);
    t.string('email', 45);
    t.datetime('discarded_at', 6);
    t.string('created_at', 600);
    t.datetime('updated_at', 6);
    t.string('tittle', 45);
    t.string('emails', 45);
    t.text('address', 45);
    t.string('country', 45);
    t.string('mobilephone', 45);
    t.string('telephone', 45);
    t.string('skypeid', 45);
    t.string('linkedinid', 45);
    t.string('description', 45);
    t.string('agree_privacy_policy', 45);
    t.text('cover_letter', 1000);
    t.text('application_mails',65535);
    t.integer('status_code', 45);
    t.integer('preferrred_contact_method_code', 45);
    t.integer('initial_communication', 45);
    t.text('tech_stack_ids', 45);
    t.integer('source_code', 45);
    t.bigint('assignee_id', 45);
    t.bigint('reporter_id', 45);
    t.bigint('created_by_id', 45);
    t.bigint('updated_by_id', 45);
    t.bigint('company_id', 45);
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
