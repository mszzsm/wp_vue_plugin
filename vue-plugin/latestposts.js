(	
	function () {
    var vm = new Vue({
        el: document.querySelector('#mount'),
        data: {
			posts: [],
			posts2: [],
            categories: [],
			users: [],
			activeCategory: "",
			color: {
				"Audyty":	["bg-audyty", "text-light"],
				"Bez kategorii": ["bg-bezkategorii", "text-light"],
                "GA":		["bg-ga", "text-light"],
				"Galeria":	["bg-galeria", "text-light"],
				"HR Payroll": ["bg-hrpayroll", "text-light"],
				"HR Recruitment & Development": ["bg-hrrecruitment", "text-light"],
				"HSE":		["bg-hse", "text-light"],
				"IT": 		["bg-it", "text-light"],
				"Monthly news": ["bg-monthlynews", "text-light"],
				"QATS issues": ["bg-qats", "text-light"],
				"QTS":		["bg-qts", "text-light"],
				"SMP-D":	["bg-smpd", "text-light"],
				"SMP-W":	["bg-smpw", "text-light"],
				"STQM":		["bg-stqm", "text-light"],
				"Trade union issues":	["bg-tradeunionissues", "text-light"]
            },
			image: 'https://picsum.photos/id/238/200/100',
			views: 0,
			first: 'item1',
			pagination: {
				offSet: 0,
				perPage: 13,
			}
			
        },

        template: `<div class="wrapper">
			<!-- Sidebar -->
				<nav id="sidebar">
					<div v-if="activeCategory != ''" id="sidebar-min">{{ activeCategory }}</div>
					<div class="flex-container">
						<button class="btn" :value="category"
							@click="changeCategory('')">
							<span> Wszystkie </span>
						</button>
						<button class="btn" v-for="category in categoryNames" :value="category"
							@click="filterByCategory(category)">
							<span> {{ category }} </span>
						</button>
					</grid>
				</nav>
					<div class="content">
						<article>
							<div class="grid-container">
								<div v-for="(post, index) in filteredPosts"  class="post grid-item" :class="{'item1': index === 0}">
									<a v-bind:href="post.link">
										<span class="badge" v-for="category in post.categories"
											v-bind:class="color[getCatName(post.categories)]">
											{{getCatName(post.categories)}}
										</span>
										<div class="title">{{post.title.rendered}}</div>
										<div class="author"><a :href="userIntranetLink(userNameById(post.author).name)">{{userNameById(post.author).name}}</a></div>
										<div class="views">	<span class="eye">&#128065;</span>0</div>
										<img class="grayimg" :src="post.fimg_url" alt="img"></a>
								</div>
							</div>
						</article>
						<div class="post-footer">
							<small id="postno">postów: {{filteredPosts.length}} </small> 
							<button class="btn" id="next" @click="Next"> Czytaj więcej </button>
						</div>
					</div>
				</div>
			</div>`,

        mounted: function () {
            console.log("Component is mounted");
			this.fetchPosts(this.pagination.perPage, this.pagination.offSet);
			this.fetchCategories();
			this.fetchUsers();

            //setInterval(function () { this.fetchPosts(this.pagination.perPage, this.pagination.offSet); 		}.bind(this), 10000);
			//setInterval(function () { this.fetchCategories();	}.bind(this), 10000);
			//setInterval(function () { this.fetchUsers(); 		}.bind(this), 10000);
        },

        methods: {
				fetchPosts: function (perPage, offSet) {
				var url = '/wp-json/wp/v2/posts?per_page=' + perPage + '&offset=' + offSet;
				fetch(url).then((response) => { return response.json() }).then((data) => {this.posts = data;});
            }, 

			fetchCategories: function () { 
			 var url = '/wp-json/wp/v2/categories?per_page=100';
				fetch(url).then((response) => { return response.json() }).then((data) => { 
					const cat = data.map(x => ({ id: x.id, name: x.name, count: x.count }))
					const fc2 = cat.filter(x => x.count > 0);
					this.categories = fc2
				});
			},

			fetchUsers: function () {
				var url = 'https://tstsrvsmp07.smp/wp-json/wp/v2/users?per_page=100';
				fetch(url).then((response) => { return response.json() }).then((data) => { this.users = data;	});
			},

			allCategoryIds: function (categoryNames) {
				let url = 'https://tstsrvsmp07.smp/wp-json/wp/v2/posts?per_page=100'
				fetch(url)
					.then((response) => { return response.json(); })
					.then((data) => { this.posts2 = data; });
			},

			filterByCategory: function (x) {
				// zwrócić wszystkie ID kategorii
				let categoryName = this.getCatId(x)
				let url = 'https://tstsrvsmp07.smp/wp-json/wp/v2/posts?categories=' + categoryName
				fetch(url).then((response) => {
					return response.json()
				})
					.then((data) => {
					this.posts = data;
					});
				console.log('Filtered by ' + categoryName)
			},

			postsByAuthor: function(name) {
				let userId = this.userId(name);
				let url = 'http://tstsrvsmp07.smp/wp-json/wp/v2/posts?author='+ userId;
				fetch(url).then((response) => {
					return response.json()
				}).then((data) => {this.posts = data})

				console.log('Filtered by ' + name)
			},

			renderImage() {
				const imagePath = "http://tstsrvsmp07.smp/wp-content/uploads/2019/06/xUWAGA.png.pagespeed.ic.IRENyPxXlt.png";
				this.image = imagePath;
				return imagePath;
			},

			// zwraca id categorii w załeżności od nazwy kategorii
			getCatId: function (name){  
				var catByName = this.categories.find(x => x.name == name);
				if (!catByName) { return 'kategoria nie znaleziona ';} 
				else { console.log(name + '=>' + catByName.id); return catByName.id; }
			},

			userId(name) {
				return this.usersName.find(x => x.name == name).id
			},

			userNameById(id) {
				return this.usersName.find(x => x.id == id)
			},

			//return NAME of category using category ID in argument 
            getCatName: function (id) { var catById = this.categories.find(x => x.id == id);
                if (!catById) 	{ return 'Bez kategorii';}
                else 			{ return catById.name;}
            },

			getUserId: function(name) { var userById = this.users.map(x => x.name == name);
				if (!userById) 	{ return 'no user'; }
				else			{ return userById.name; }
			},

			activeCategories: function(categoryName){
				return this.categories.filter(x =>  x.name == categoryName )
			},

			changeCategory: function (x) { 
					this.pagination.perPage = 100
					this.fetchPosts(100,0)
					this.activeCategory = x; 
					console.log(x + 'clicked'); 
					return x 
			},

			userIntranetLink: function(author) {
				let nameSurname = author.split(" ")
				let username = nameSurname[0][0] + '.'+ nameSurname[1]
				return "http://srvsmp0025/employee/?task=employee&action=employeeCard&employee=" + username.toLowerCase()
			}, 

			Next: function () {
				this.pagination.offSet = this.pagination.offSet + this.pagination.perPage
				this.fetchPosts(this.pagination.offSet,  this.pagination.perPage);
			},

			Prev: function () {
				this.pagination.offSet = this.pagination.offSet - this.pagination.perPage
				this.fetchPosts(this.pagination.offSet,  this.pagination.perPage);
			},
		},

		computed: {
            filteredPosts() {
                const active = this.activeCategory;
                if (active == "") { 
                    return this.posts;
                } else {
					var postId = this.getCatId(this.activeCategory)
					console.log(postId)
					var id = this.posts.filter((Post) => Post.categories[0] == postId);
                    return id;
                }
			},

			usersName: function () { return this.users.map(x => ({ name: x.name, id: x.id })) },
			categoryNames() { return [...new Set(this.categories.map(x => x.name))] }
        },
    })
	}
)();
