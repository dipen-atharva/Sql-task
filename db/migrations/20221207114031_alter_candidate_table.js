/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable('candidates', (t) => {
    t.bigint('wp_post_id');
    t.string('wp_applied_for');
    t.string('wp_first_name');
    t.string('wp_last_name');
    t.text('wp_email');
    t.timestamp('wp_created_at');
    t.timestamp('wp_updated_at');
    t.string('wp_mobilephone');
    t.string('wp_agree_privacy_policy');
    t.text('wp_cover_letter');
    t.text('wp_post_meta_data');
    t.text('wp_application_mails');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable("candidates", (t) => {
    t.dropColumn('wp_post_id');
    t.dropColumn('wp_applied_for');
    t.dropColumn('wp_first_name');
    t.dropColumn('wp_last_name');
    t.dropColumn('wp_email');
    t.dropColumn('wp_created_at');
    t.dropColumn('wp_updated_at');
    t.dropColumn('wp_mobilephone');
    t.dropColumn('wp_agree_privacy_policy');
    t.dropColumn('wp_cover_letter');
    t.dropColumn('wp_post_meta_data');
    t.dropColumn('wp_application_mails');
  });
};
