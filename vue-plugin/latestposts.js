(
	function () {
    var vm = new Vue({
        el: document.querySelector('#mount'),
        data: {
           
            posts: [],
            categories: [],
			users: [],
			activeCategory: "",
			color: {
				"Audyty": ["bg-audyty", "text-light"],
				"Bez kategorii": ["bg-bezkategorii", "text-light"],
                "GA": ["bg-ga", "text-light"],
				"Galeria": ["bg-galeria", "text-light"],
				"HR Payroll": ["bg-hrpayroll", "text-light"],
				"HR Recruitment & Development": ["bg-hrrecruitment", "text-light"],
				"HSE": ["bg-hse", "text-light"],
				"IT": ["bg-it", "text-light"],
				"Mounthly news": ["bg-monthlynews", "text-light"],
				"QATS issues": ["bg-qats", "text-light"],
				"QTS": ["bg-qts", "text-light"],
				"SMP-D": ["bg-smpd", "text-light"],
				"SMP-W": ["bg-smpw", "text-light"],
				"STQM": ["bg-stqm", "text-light"],
				"Trade union issues": ["bg-tradeunionissues", "text-light"]
            },
			image: 'https://picsum.photos/id/238/200/100',
			views: 0,
			first: 'item1',
			OffSet: 0,
			perPage: 13,
			
        },

        template: `<div class="wrapper">
			<!-- Sidebar -->
				<div id="sidebar-min">{{activeCategory}}</div>
					<nav id="sidebar">
						<button class="btn btn-active" @click="changeCategory('')">All </button>
						<button class="btn" v-for="category in categoryNames" :value="category"
							@click="changeCategory(category)">
							<span> {{ category }} </span>
						</button>
					</nav>
					<div class="content">
						<div class="active_cat">{{activeCategory}}</div>
						<article>
							<div class="grid-container">
								<div v-for="(post, index) in filteredPosts"  class="post grid-item" :class="{'item1': index === 0}">
										<span class="badge" v-for="category in post.categories"
											v-bind:class="color[getCatName(post.categories)]">
											{{getCatName(post.categories)}}
										</span>
										<div class="title">{{post.title.rendered}}</div>
										<div class="author">{{getUserId(post.author)}}</div>
										<a v-bind:href="post.link"><img class="grayimg" :src="post.fimg_url" alt="img"></a>
								</div>
							</div>
						</article>
					</div>
				</div>`,

 
		
        mounted: function () {
            console.log("Component is mounted");
			this.fetchPosts();
			this.fetchCategories();
			this.fetchUsers();
			
            setInterval(function () { this.fetchPosts(); 		}.bind(this), 10000);
			setInterval(function () { this.fetchCategories();	}.bind(this), 10000);
			setInterval(function () { this.fetchUsers(); 		}.bind(this), 10000);
        },
	
        methods: {
            fetchPosts: function () {
				var url = '/wp-json/wp/v2/posts?per_page=' + this.perPage + '&offset=' + this.OffSet;
             fetch(url).then((response) => { return response.json() }).then((data) => {this.posts = data;});
            }, 

			fetchCategories: function () { 
			 var url = '/wp-json/wp/v2/categories?per_page=100';
				fetch(url).then((response) => { return response.json() }).then((data) => { this.categories = data;});
			},

			fetchUsers: function () {
		  	 var url = '/wp-json/wp/v2/users?per_page=100';
			 fetch(url).then((response) => { return response.json() }).then((data) => { this.users = data;	});
			},
			
			// zwraca id categorii w załeżności od nazwy kategorii
			getCatId: function (name){  var catByName = this.categories.find(x => x.name == name);
				if (!catByName) { return 'kategoria nie znaleziona ';} 
				else 			{ console.log(name + '=>' + catByName.id); return catByName.id; }
			},
			
			//return NAME of category using category ID in argument 
            getCatName: function (id) { var catById = this.categories.find(x => x.id == id);
                if (!catById) 	{ return 'Bez kategorii';}
                else 			{ return catById.name;}
            },
			
			getUserId: function(name) { var userById = this.users.find(x => x.id == name);
				if (!userById) 	{ return 'no user'; }
				else			{ return userById.name; }
			},
			
			changeCategory: function (x) { 
					this.activeCategory = x; 
					console.log(x + ' clicked'); 
					return x
				},
			
			renderImage() {
                const imagePath = "http://tstsrvsmp07.smp/wp-content/uploads/2019/06/xUWAGA.png.pagespeed.ic.IRENyPxXlt.png";
                this.image = imagePath;
                return imagePath;
            }
        },
		
		computed: {
            filteredPosts() {
                const active = this.activeCategory;
                if (active == "") { 
                    return this.posts;
                } else {
                    var postId = this.getCatId(this.activeCategory)
					var id = this.posts.filter((Post) => Post.categories[0] == postId);
                    return id;
                }
			},
			
			categoryNames() { return [...new Set(this.categories.map(x => x.name))] }

        },
    })
	}
)();
