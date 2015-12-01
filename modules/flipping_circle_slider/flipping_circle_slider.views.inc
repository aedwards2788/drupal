<?php
/**
* Implement hook_views_plugins()
* 
* Adds a view style to the Views UI interface
*/
function flipping_circle_slider_views_plugins(){
	return array(
		'style' => array(
			'flipping_circle_slider' => array(
   			    'title' => t('Flipping Circle Slider'),
				'help' => t('Displays rows in a flipping circle slider.'),
				'handler' => 'views_plugin_style_flipping_circle_slider',
				'theme' => 'views_view_flipping_circle_slider',
				'uses fields' => TRUE,
				'uses row plugin' => TRUE,
				'uses row class' => TRUE,
				'uses options' => TRUE,
				'type' => 'normal',
				'help topic' => 'style-grid',
			  ),
		),
	);
 }//End hook views plugin