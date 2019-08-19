<?php
/*
Plugin Name: Vue Posts Plugin 
Description: Latest posts shortcode
Version: 1.0
*/

//shortcode creation 
function handle_shortcode() {
    return '<div id="mount">Mount DIV</div>' ;
}
add_shortcode('latestPosts', 'handle_shortcode');



function my_stylesheet(){
    wp_register_style('styles', plugin_dir_url( __FILE__ ) .'/assets/style.css');
    wp_enqueue_style('styles');
//create vue connection 
function enqueue_scripts(){
   global $post;
	if(has_shortcode($post->post_content, "latestPosts")){
      wp_enqueue_script('vuejs', 'https://cdn.jsdelivr.net/npm/vue@2.5.17/dist/vue.js', [], '2.5.17');
      wp_enqueue_script('latestposts', plugin_dir_url( __FILE__ ) . 'latestposts.js', [], '1.0', true);
	}
};

add_action('wp_enqueue_scripts', 'enqueue_scripts'); 
add_action('wp_enqueue_scripts', 'my_stylesheet' );

add_action('rest_api_init', 'register_rest_images' );

function register_rest_images(){
    register_rest_field( array('post'),
        'fimg_url',
        array(
            'get_callback'    => 'get_rest_featured_image',
            'update_callback' => null,
            'schema'          => null,
        )
    );
}

function get_rest_featured_image( $object, $field_name, $request ) {
    if( $object['featured_media'] ){
        $img = wp_get_attachment_image_src( $object['featured_media'], 'app-thumb' );
        return $img[0];
    }
    return false;
}
