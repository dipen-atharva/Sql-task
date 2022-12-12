/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('candidates', (t) => {
    t.increments('id').primary();
    t.timestamp('discarded_at');
    t.string('tittle');
    t.string('emails');
    t.text('address');
    t.string('country');
    t.string('telephone');
    t.string('skypeid');
    t.string('linkedinid');
    t.string('description');
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
