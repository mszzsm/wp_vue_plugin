(function() {
    var vm = new Vue({
        el: document.querySelector('#mount'),
        data: {
            posts: []
        },
        template: "<h1>My Latest Post Widget</h1>",
        mounted: function(){
            console.log('Hello vue!');
        }
    })
    
})();