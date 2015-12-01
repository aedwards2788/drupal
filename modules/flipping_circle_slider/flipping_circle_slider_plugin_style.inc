<?php
/**
* Flipping Circle Slider plugin that alters the display of a node into a cool slider
* 
* @ingroup views_style_plugins
*/
class views_plugin_style_flipping_circle_slider extends views_plugin_style {
/** 
* Set default options 
*/
	function options(&$options) { 
	$options['height'] = array('default' => '300px'); 
	$options['width'] = array('default' => '100%'); 
	$options['main_title'] = array('default' => ''); 
	return $options; 
	}
   
/**
 * Create forms to hold these values allowing the user to change the values 
 */ 
	function options_form(&$form, &$form_state) { 
		$form['height'] = array( 
			'#type' => 'textfield', 
			'#title' => t('Height'), 
			'#size' => '30', 
			'#description' => t('This field determines how tall the slider will be'), 
			'#default_value' => $this->options['height'], 
		); 
		$form['width'] = array( 
			'#type' => 'textfield', 
			'#title' => t('Width'), 
			'#size' => '30', 
			'#description' => t('This field determines how wide the slider will be'), 
			'#default_value' => $this->options['width'], 
		); 
		$form['title_main'] = array( 
			'#type' => 'textfield', 
			'#title' => t('Main Title'), 
			'#size' => '30', 
			'#description' => t('Slider Title'), 
			'#default_value' => $this->options['title_main'],
		); 
	} 
}