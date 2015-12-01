<?php
function client_target_views_query_alter(&$view, &$query) {
  $query->distinct = 1;
  global $user;
  $account = user_load($user->uid);
  $views = variable_get('targeted_view_names');
  $fields = variable_get('targeted_field_names');
  //Refactor later
  $user_business = field_get_items('user', $account, 'field_business');
  $user_function = field_get_items('user', $account, 'field_function');
  $user_location = field_get_items('user', $account, 'field_location');
  $business_all_term = key(taxonomy_get_term_by_name('All', 'client_businesses'));
  $location_all_term = key(taxonomy_get_term_by_name('All', 'client_locations'));
  $function_all_term = key(taxonomy_get_term_by_name('All', 'client_functions'));
  //Add all term to locations
  $location[] = $location_all_term;
  //Add all term to businesses
  $business[] = $business_all_term;
  //Add all term to businesses
  $function[] = $function_all_term;
    if(in_array($view->name, $views)){
      if(user_is_logged_in()) {
        $query->add_table('field_data_field_targeted');
        //Store each location term id
        foreach ($user_location as $value) {
          $location[] = $value['tid'];
        }
        //Store each location term id
        foreach ($user_business as $value) {
          $business[] = $value['tid'];
        }
        //Store each location term id
        foreach ($user_function as $value) {
          $function[] = $value['tid'];
        }
          //target content based on business
          $business_table = "field_data_field_business";
          $business_field = "field_data_field_business.field_business_tid";
          $query->add_table($business_table);
          $query->add_where(
            0,
            db_or()
              ->condition($business_field, $business, 'IN')
              ->condition($business_field, $value, 'IS NULL')
              ->condition('field_data_field_targeted.field_targeted_value', 0, '=')
              ->condition('field_data_field_targeted.field_targeted_value', $value, 'IS NULL')
          );
          //target content based on function
          $function_table = "field_data_field_function";
          $function_field = "field_data_field_function.field_function_tid";
          $query->add_table($function_table);
          $query->add_where(
            0,
            db_or()
              ->condition($function_field, $function, 'IN')
              ->condition($function_field, $value, 'IS NULL')
              ->condition('field_data_field_targeted.field_targeted_value', 0, '=')
              ->condition('field_data_field_targeted.field_targeted_value', $value, 'IS NULL')
          );

          //target content based on location
          $location_table = "field_data_field_location";
          $location_field = "field_data_field_location.field_location_tid";
          $query->add_table($location_table);
          $query->add_where(
            0,
            db_or()
              ->condition($location_field, $location, 'IN')
              ->condition($location_field, $value, 'IS NULL')
              ->condition('field_data_field_targeted.field_targeted_value', 0, '=')
              ->condition('field_data_field_targeted.field_targeted_value', $value, 'IS NULL')
          );
      }//End if statement
      //If users is not logged in remove targeted content boolean flag.
      if(!user_is_logged_in()){
        $query->add_table('field_data_field_targeted');
        $query->add_where(
          0,
          db_or()
            ->condition('field_data_field_targeted.field_targeted_value', 0, '=')
            ->condition('field_data_field_targeted.field_targeted_value', $value, 'IS NULL')
        );
      }
    }//End if statement
}//End function
