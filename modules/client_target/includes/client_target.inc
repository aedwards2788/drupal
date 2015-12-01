<?php
/*
* Function takes the user object and the node object and checks if the user has access to the node.
* if the user does not have access to the node  hide the node from the user.
*/
function _client_target($account, $node){
  $target_fields = variable_get('targeted_field_names');
  /*
  * Check if use has any fields used for targeting if they do not
  * have any applicable fields do not operate this check using field match flag
  */
  foreach ($target_fields as $key => $value) {
    if(!empty($account->{$value}) && !empty($node->{$value})){
      $user_lang = field_language('user', $node, $value);
      $node_lang = field_language('node', $node, $value);
      //Populate target flags
      $target_flag[$value] = _set_flag($node->{$value}, $account->{$value},
      $node_lang, $user_lang);
    }//End if
  }//End foreach loop
  //If the user has does not have access return false;
  if(empty($target_flag) || in_array(0, $target_flag)){
      return FALSE;
  }//End if
  //Otherwise the user has access to the node.
  return TRUE;
}

function _set_flag($node_field, $user_field, $node_field_language, $user_field_language){
  foreach($node_field[$node_field_language] as $key=>$value){
    //Base case: if term is equal to all return 1.
    $all_term = key(taxonomy_get_term_by_name('All', taxonomy_term_load($value['tid'])->vocabulary_machine_name));
    if($value['tid']==$all_term || empty($value)){
      return 1;
    }
    $node_field[$value['tid']] = $key;
  }//End foreach
  foreach($user_field[$user_field_language] as $key=>$value){
    if(isset($node_field[$value['tid']])){
      return 1;
    }//End if
  }//End foreach
  return 0;
}

/*
* Operate only on specified nodes
*/
function _client_node_check($node, $content_types){
  if(isset($content_types[$node->type])){
    return TRUE;
  }
  else{
    return FALSE;
  }
}
