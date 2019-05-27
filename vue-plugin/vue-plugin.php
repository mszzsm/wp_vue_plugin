<?php
/*
Plugin Name: Vue Posts Plugin 
Description: Latest posts shortcode
Version: 1.0
*/

//shortcode creation 
function handle_shortcode() {
    return '<div id="mount">Mount DIV</div>';
	
}
add_shortcode('latestPosts', 'handle_shortcode');


//create vue connection 
function enqueue_scripts(){
   global $post;
	if(has_shortcode($post->post_content, "latestPosts")){
      wp_enqueue_script('vuejs', 'https://cdn.jsdelivr.net/npm/vue@2.5.17/dist/vue.js', [], '2.5.17');
      wp_enqueue_script('latestposts', plugin_dir_url( __FILE__ ) . 'latestposts.js', [], '1.0', true);
	}
};

add_action('wp_enqueue_scripts', 'enqueue_scripts'); 