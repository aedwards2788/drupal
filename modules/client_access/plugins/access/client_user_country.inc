<?php
/**
 *Plugins are described by creating a $plugin array which will
 * be used by the system that includes the file.
 */
 $plugin = array(
  'title' => t('User: Country & Language'),
  'description' => t('Controls acceses according to anonymous user country and language'),
  'callback' => 'client_access_country_ctools_access_check',
  'settings form' => 'client_access_country_ctools_settings',
  'summary' => 'client_access_country_ctools_summary',
  );

/**
 * Custom callback defined by 'callback' in the $plugin array.
 *
 * Check for access.
 */
function client_access_country_ctools_access_check($conf, $context) {
  if(user_is_anonymous() && in_array(session_cache_get('anonymous_user_country'), $conf['user_countries'])
    && in_array(session_cache_get('anonymous_user_language'), $conf['user_language'])) {
    return TRUE;
  }
  else if(user_is_anonymous()) {
    return FALSE;
  }
  //return TRUE;
}//End Access function

/**
 * Settings form for the 'Role' access plugin.
 */
function client_access_country_ctools_settings($form, &$form_state, $conf) {
  $countries = country_get_list();
  $country_options = variable_get('anonymous_user_country');
  $languages = i18n_language_list();
  $form['settings']['user_countries'] = array(
    '#type' => 'select',
    '#options' => $countries,
    '#title' => t('User: Country'),
    '#description' => t('The pane will only be visible if the user countries is the same as set on this field.'),
    '#default_value' => $conf['user_countries'],
    '#multiple' => TRUE,
  );
  $form['settings']['user_language'] = array(
    '#type' => 'select',
    '#options' => $languages,
    '#title' => t('User: Language'),
    '#description' => t('The pane will only be visible if the user language is the same as set on this field.'),
    '#default_value' => $conf['user_language'],
    '#multiple' => TRUE,
  );
  return $form;
}

/**
 * Display description for each access rule added.
 */
function client_access_country_ctools_summary($conf, $context) {
  return t('Content is visible only to anonymous users with countries matching values in list');
}
