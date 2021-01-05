var pbpFavPostsCnt = typeof pbpFavPostsCnt == 'undefined' ? 0 : pbpFavPostsCnt + 1;

(function(nr) {
	
	function getIdByUrl(url, kalbak) {
		let zap = new XMLHttpRequest();
		zap.open('GET', url);
		zap.onload = function() {
			if (zap.status === 200) {
				let postId;
				if (zap.response.indexOf("'postId':") >= 0 && zap.response.split("'postId':")[1].indexOf("'") && !isNaN(zap.response.split("'postId':")[1].split("'")[1])) {
					postId = zap.response.split("'postId':")[1].split("'")[1];
				} else if (zap.response.indexOf("postID=") >= 0 && !isNaN(zap.response.split("postID=")[1].split(/\&|\'/)[0])) {
					postId = zap.response.split("postID=")[1].split(/\&|\'/)[0];
				}
				kalbak(postId);
			}
		}
		zap.send();
	}
	
	
	function lapUrl(el) {
		if (el.tagName === 'A' && el.getAttribute('href')) {
			let href = el.getAttribute('href').split('?')[0];
			if (href.indexOf(location.protocol + '//' + location.host) === 0 && /.*\/\d{4}\/\d{2}\/.*\.html/.test(href)) {
				return el;
			} else if (el.parentNode && el.parentNode.id !== 'main' && el.parentNode !== document.body) {
				return lapUrl(el.parentNode);
			} else {
				return null;
			}
		}
	}
	
	function pierdolnij(gdzie, url) {
		let dyw = document.createElement('div');
		dyw.style.textAlign = position;
		dyw.style.height = (iconSize + 2) + 'px';
		let ul = document.createElement('span');
		ul.setAttribute('class', 'pbpFavourite');
		let inf = document.createElement('span');
		inf.setAttribute('class', 'pbpFavInfo');
		document.body.appendChild(inf);
		if (ulubiene.filter(a => a.u === url).length === 0) {
			ul.setAttribute('active', 'false');
			inf.textContent = 'Add to favorites';
		} else {
			ul.setAttribute('active', 'true');
			inf.textContent = 'Remove from favorites';
		}
		ul.onclick = function() {
			if (this.getAttribute('active') === 'true') {
				this.setAttribute('active', 'false');
				inf.textContent = 'Removed';
				setTimeout(function() {
					inf.textContent = 'Add to favorites';
				}, 1000);
				ulubiene = ulubiene.filter(a => a.u !== url);
			} else {
				this.setAttribute('active', 'true');
				inf.textContent = 'Added';
				setTimeout(function() {
					inf.textContent = 'Remove from favorites';
				}, 1000);
				if (ulubiene.filter(a => a.u === url).length === 0) ulubiene.push({
					'u' : url
				});
				getIdByUrl(url, function(id) {
					for (let a=0;a<ulubiene.length;a++) {
						if (ulubiene[a].u === url) {
							ulubiene[a].i = id;
							localStorage.pbpFavorites = JSON.stringify(ulubiene);
						}
					}
				});
			}
			localStorage.pbpFavorites = JSON.stringify(ulubiene);
		}
		ul.onmouseenter = function() {
			inf.style.display = 'inline-block';
			setTimeout(function() {
				inf.style.opacity = '1';
			}, 5);
		}
		ul.onmouseleave = function(e) {
			inf.style.opacity = '0';
			inf.style.display = 'none';
		}
		ul.onmousemove = function(e) {
			inf.style.left = (e.pageX + wyrPrawX + inf.offsetWidth + 10 > window.scrollX + window.innerWidth ? e.pageX - wyrLewX - inf.offsetWidth : e.pageX + wyrPrawX) + 'px';
			inf.style.top = (e.pageY + wyrDolY + inf.offsetHeight + 10 > window.scrollY + window.innerHeight ? e.pageY - wyrGorY - inf.offsetHeight : e.pageY + wyrDolY) + 'px';
		}
		dyw.appendChild(ul);
		gdzie.parentNode.insertBefore(dyw, gdzie);
	}
	
	let ulubiene = [];
	if (localStorage.pbpFavorites) {
		ulubiene = JSON.parse(localStorage.pbpFavorites);
	} else {
		localStorage.pbpFavorites = '[]';
	}
	
	let bazaIkon = {
		'heart' : {
			'pusta' : 'M458.4 64.3C400.6 15.7 311.3 23 256 79.3 200.7 23 111.4 15.6 53.6 64.3-21.6 127.6-10.6 230.8 43 285.5l175.4 178.7c10 10.2 23.4 15.9 37.6 15.9 14.3 0 27.6-5.6 37.6-15.8L469 285.6c53.5-54.7 64.7-157.9-10.6-221.3zm-23.6 187.5L259.4 430.5c-2.4 2.4-4.4 2.4-6.8 0L77.2 251.8c-36.5-37.2-43.9-107.6 7.3-150.7 38.9-32.7 98.9-27.8 136.5 10.5l35 35.7 35-35.7c37.8-38.5 97.8-43.2 136.5-10.6 51.1 43.1 43.5 113.9 7.3 150.8z',
			'pelna' : 'M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z',
			'vB' : '0 0 512 512'
		},
		'star' : {
			'pusta' : 'M528.1 171.5L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6zM388.6 312.3l23.7 138.4L288 385.4l-124.3 65.3 23.7-138.4-100.6-98 139-20.2 62.2-126 62.2 126 139 20.2-100.6 98z',
			'pelna' : 'M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z',
			'vB' : '0 0 576 512'
		},
		'thumb' : {
			'pusta' : 'M466.27 286.69C475.04 271.84 480 256 480 236.85c0-44.015-37.218-85.58-85.82-85.58H357.7c4.92-12.81 8.85-28.13 8.85-46.54C366.55 31.936 328.86 0 271.28 0c-61.607 0-58.093 94.933-71.76 108.6-22.747 22.747-49.615 66.447-68.76 83.4H32c-17.673 0-32 14.327-32 32v240c0 17.673 14.327 32 32 32h64c14.893 0 27.408-10.174 30.978-23.95 44.509 1.001 75.06 39.94 177.802 39.94 7.22 0 15.22.01 22.22.01 77.117 0 111.986-39.423 112.94-95.33 13.319-18.425 20.299-43.122 17.34-66.99 9.854-18.452 13.664-40.343 8.99-62.99zm-61.75 53.83c12.56 21.13 1.26 49.41-13.94 57.57 7.7 48.78-17.608 65.9-53.12 65.9h-37.82c-71.639 0-118.029-37.82-171.64-37.82V240h10.92c28.36 0 67.98-70.89 94.54-97.46 28.36-28.36 18.91-75.63 37.82-94.54 47.27 0 47.27 32.98 47.27 56.73 0 39.17-28.36 56.72-28.36 94.54h103.99c21.11 0 37.73 18.91 37.82 37.82.09 18.9-12.82 37.81-22.27 37.81 13.489 14.555 16.371 45.236-5.21 65.62zM88 432c0 13.255-10.745 24-24 24s-24-10.745-24-24 10.745-24 24-24 24 10.745 24 24z',
			'pelna' : 'M104 224H24c-13.255 0-24 10.745-24 24v240c0 13.255 10.745 24 24 24h80c13.255 0 24-10.745 24-24V248c0-13.255-10.745-24-24-24zM64 472c-13.255 0-24-10.745-24-24s10.745-24 24-24 24 10.745 24 24-10.745 24-24 24zM384 81.452c0 42.416-25.97 66.208-33.277 94.548h101.723c33.397 0 59.397 27.746 59.553 58.098.084 17.938-7.546 37.249-19.439 49.197l-.11.11c9.836 23.337 8.237 56.037-9.308 79.469 8.681 25.895-.069 57.704-16.382 74.757 4.298 17.598 2.244 32.575-6.148 44.632C440.202 511.587 389.616 512 346.839 512l-2.845-.001c-48.287-.017-87.806-17.598-119.56-31.725-15.957-7.099-36.821-15.887-52.651-16.178-6.54-.12-11.783-5.457-11.783-11.998v-213.77c0-3.2 1.282-6.271 3.558-8.521 39.614-39.144 56.648-80.587 89.117-113.111 14.804-14.832 20.188-37.236 25.393-58.902C282.515 39.293 291.817 0 312 0c24 0 72 8 72 81.452z',
			'vB' : '0 0 512 512'
		}
	}
		
	let wyrPrawX = 15;
	let wyrLewX = 7;
	let wyrDolY = 12;
	let wyrGorY = 0;
		
	let sel = ['.post', '.post-outer', 'article', '.item', '.blog-post', '.hentry', '.index-post'];
	let sel2 = ['.post-title', 'h1', 'h2', 'h3'];
	let selMain = ['#main', '#Blog1', '#Blog00'];
	
	let skrypt = document.querySelectorAll('script[src="https://probloggerplugins.github.io/widgets/favorite-posts.js"]')[nr];
	
	let icon = skrypt.getAttribute('icon');
	if (icon !== 'star' && icon !== 'thumb') icon = 'heart';
	
	let iconSize = Number(skrypt.getAttribute('iconSize'));
	if (iconSize < 8 || isNaN(iconSize)) iconSize = 20;
	
	let iconColor = skrypt.getAttribute('iconColor') ? skrypt.getAttribute('iconColor') : '#000000';
	
	let favoritePostsText = skrypt.getAttribute('favoritePostsText') ? skrypt.getAttribute('favoritePostsText') : 'Favorites Posts';
	
	let showTitle = skrypt.getAttribute('showTitle') === 'false' ? false : true;
	
	let showAuthor = skrypt.getAttribute('showAuthor') === 'false' ? false : true;
	
	let showComments = skrypt.getAttribute('showComments') === 'false' ? false : true;
	
	let showDate = skrypt.getAttribute('showDate') === 'false' ? false : true;
	
	let showLabels = skrypt.getAttribute('showLabels') === 'false' ? false : true;
	
	let showSummary = skrypt.getAttribute('showSummary') === 'false' ? false : true;
	
	let showImage = skrypt.getAttribute('showImage') === 'false' ? false : true;
	
	let iconType = skrypt.getAttribute('iconType');
	if (iconType !== 'heart' && iconType !== 'star') iconType = 'heart';
	
	let position = skrypt.getAttribute('position');
	if (position !== 'left' && position !== 'center') position = 'right';
	
	
	function wyswietl(postId, dyw) {
		let zap2 = new XMLHttpRequest();
		zap2.open('GET', '/feeds/posts/summary/' + postId);
		zap2.onload = function() {
			if (zap2.status === 200) {
				let wpis = zap2.responseXML.querySelector('entry');
							
				let obi = {
					'u' : wpis.querySelector('link[rel="alternate"]').getAttribute('href'),
					't' : wpis.querySelector('title') ? wpis.querySelector('title').textContent : 'Untitled',
					'd' : wpis.querySelector('published') ? wpis.querySelector('published').textContent.substring(0, 10) : '2021-01-01',
					'a' : wpis.querySelector('author') && wpis.querySelector('author').querySelector('name') ? wpis.querySelector('author').querySelector('name').textContent : 'Anonymous',
					'k' : wpis.getElementsByTagName('thr\:total').length ? Number(wpis.getElementsByTagName('thr\:total')[0].textContent) : 0,
					'l' : [],
					's' : wpis.querySelector('summary') ? wpis.querySelector('summary').textContent.replace(/<(?:.|\n)*?>/gm, '').substring(0, 220) : '',
					'o' : wpis.getElementsByTagName('media\:thumbnail').length ? wpis.getElementsByTagName('media\:thumbnail')[0].getAttribute('url') : 'https://3.bp.blogspot.com/-go-1bJQKzCY/XIpRVUCKeCI/AAAAAAAAAQM/YUdYK3hEkcIFwcz0r-T2uErre0JOJWnrwCLcBGAs/s1600/no-image.png'				
				}
							
				wpis.querySelectorAll('category').forEach(k => obi.l.push(k.getAttribute('term')));
							
				let dyw2 = document.createElement('div');
				dyw2.setAttribute('class', 'pbpFavPostBox');
				
				let html = '';
				
				if (showImage) html += '<img src="' + obi.o + '">';
							
				html = '<div class="favorite-post-title"><a href="' + obi.u + '" title="' + obi.t + '">' + obi.t + '</a></div>';
				if (showAuthor || showComments || showDate) html += '<div class="favorite-post-info">';
				if (showAuthor) html += '<span title="Author: ' + obi.a + '"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path></svg>' + obi.a + '</span>';
				if (showComments) html += '<span title="' + obi.k + ' comments"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32z"></path></svg>' + obi.k + '</span>';
				if (showDate) html += '<span title="Published ' + obi.d + '"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M148 288h-40c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12zm108-12v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm96 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm-96 96v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm-96 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm192 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm96-260v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h48V12c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h128V12c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h48c26.5 0 48 21.5 48 48zm-48 346V160H48v298c0 3.3 2.7 6 6 6h340c3.3 0 6-2.7 6-6z"></path></svg>' + obi.d + '</span>';
				if (showAuthor || showComments || showDate) html += '</div>';
				if (showLabels) html += '<div class="favorite-post-labels">';
				if (showLabels) obi.l.forEach(k => html += '<span title="' + k + '"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 252.118V48C0 21.49 21.49 0 48 0h204.118a48 48 0 0 1 33.941 14.059l211.882 211.882c18.745 18.745 18.745 49.137 0 67.882L293.823 497.941c-18.745 18.745-49.137 18.745-67.882 0L14.059 286.059A48 48 0 0 1 0 252.118zM112 64c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48z"></path></svg>' + k + '</span>');
				if (showLabels) html += '</div>';
				if (showSummary) html += '<div class="favorite-post-summary">' + obi.s + '... <a title="Read more" href="' + obi.u + '" class="pbpReadMore"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34zm192-34l-136-136c-9.4-9.4-24.6-9.4-33.9 0l-22.6 22.6c-9.4 9.4-9.4 24.6 0 33.9l96.4 96.4-96.4 96.4c-9.4 9.4-9.4 24.6 0 33.9l22.6 22.6c9.4 9.4 24.6 9.4 33.9 0l136-136c9.4-9.2 9.4-24.4 0-33.8z"></path></svg></a></div>';
				
				dyw2.innerHTML = html;
				
				dyw.appendChild(dyw2);
				
				if (document.getElementsByClassName('pbpFavPostBox').length === ulubiene.length) {
					document.querySelector('.pbpLoadIcon').remove();
				}
			}
		}
		zap2.send();
	}
	
	
	
	let poka = document.createElement('a');
	poka.textContent = favoritePostsText;
	skrypt.parentNode.insertBefore(poka, skrypt);
	poka.onclick = function() {
		let okno = document.createElement('div');
		okno.setAttribute('class', 'FavoritePostsWindow');
		document.body.appendChild(okno);
		
		let cofdyw = document.createElement('div');
		cofdyw.setAttribute('class', 'pbpBackDiv');
		okno.appendChild(cofdyw);
		let wstecz = document.createElement('span');
		wstecz.setAttribute('class', 'pbpArrowBack');
		wstecz.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z"></path></svg>';
		wstecz.onclick = function() {
			document.body.removeChild(okno);
		}
		cofdyw.appendChild(wstecz);
		let tytul = document.createElement('div');
		tytul.setAttribute('class', 'FavPostsPageTitle')
		tytul.innerHTML = 'Favorite Posts';
		okno.appendChild(tytul);
		
		let body = document.createElement('div');
		body.setAttribute('class', 'FavoritePostsBody');
		okno.appendChild(body);
		
		if (ulubiene.length) {
			
			let loDiv = document.createElement('div');
			okno.appendChild(loDiv);
			let load = document.createElement('div');
			load.setAttribute('class', 'pbpLoadIcon');
			loDiv.appendChild(load);
			
			for (let x=0;x<ulubiene.length;x++) {

				let dyw = document.createElement('div');
				body.appendChild(dyw);
				
				if (ulubiene[x].i) {
					wyswietl(ulubiene[x].i, dyw);
				} else {
					getIdByUrl(ulubiene[x].u, function(postId) {
						wyswietl(postId, dyw);
					})
				}
				
			}
		} else {
			body.innerHTML = 'You have no posts in your favorites list.';
		}
		
	}
	
	
	
	let styl = document.createElement('style');
	styl.innerHTML = `
.pbpFavourite{display:inline-block;width:${iconSize+2}px;height:${iconSize+2}px;background-repeat:no-repeat;background-size:${iconSize}px ${iconSize}px;background-position:1px 1px;cursor:pointer;z-index:99999999;}

.pbpFavourite[active="false"] {background-image:url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="${bazaIkon[icon].vB}"><path fill="${encodeURIComponent(iconColor)}" d="${bazaIkon[icon].pusta}"></path></svg>')}

.pbpFavourite[active="true"] {background-image:url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="${bazaIkon[icon].vB}"><path fill="${encodeURIComponent(iconColor)}" d="${bazaIkon[icon].pelna}"></path></svg>')}

.pbpFavourite:hover{background-size:${iconSize+2}px ${iconSize+2}px;background-position:0px 0px;}

.pbpFavourite:active{background-size:${iconSize-2}px ${iconSize-2}px;background-position:2px 2px;}

.pbpFavInfo{display:none;opacity:0;position:absolute;z-index:9999999;width:90px;padding:3px;background:yellow;border:1px solid black;color:black;border-radius:7px;text-align:center;transition:opacity 0.6s;font-family:Calibri;font-size:13px;line-height:1.2;}

.FavoritePostsWindow{display:block;position:fixed;top:0;left:0;width:100%;height:100%;overflow:auto;background:white;z-index:999999999;}

.FavoritePostsBody{max-width:600px;margin:auto;}

.pbpBackDiv{height:30px;boxSizing:border-box;padding:5px 5px 0 2px;background:#323232;color:white;}

.pbpArrowBack{padding:2px 2px 2px 8px;cursor:pointer;color:white;}
.pbpArrowBack svg{height:22px;}
.pbpArrowBack:hover{padding:1px 1px 1px 7px;}
.pbpArrowBack:hover svg{height:24px;}
.pbpArrowBack:active{padding:1px 7px 1px 1px;}

.FavPostsPageTitle{font-size:22px;background:#323232;color:white;padding-bottom:8px;font-weight:bold;margin-bottom:16px;text-align:center;}

.pbpFavPostBox{padding:7px;border:1px solid black;border-radius:10px;margin-bottom:12px;background:#d6d6d6;line-height:1.25;color:black;}
pbpFavPostBox:after{content:'';display:block;clear:both;}
.pbpFavPostBox img {float:left;margin:0 5px 5px 0;border-radius:5px;border:none;padding:0;width:75px;height:auto;}

.favorite-post-title{margin-bottom:8px;}
.favorite-post-title a{font-size:18px;color:#890000;text-decoration:none;font-family:"Palatino Linotype","Book Antiqua",Palatino,serif;font-weight:bold;}
.favorite-post-title a:hover{text-decoration:underline;}

.favorite-post-info{padding:10px;}
.favorite-post-info span{display:inline-flex;align-items:center;font-size:16px;cursor:default;}
.favorite-post-info span:not(:last-child){margin-right:15px;}
.favorite-post-info span svg{height:14px;margin-right:3px;fill:currentColor;}

.favorite-post-labels span{display:inline-flex;align-items:center;padding:2px 5px;border-radius:5px;margin:5px;background:#9d0000;color:white;cursor:default}
.favorite-post-labels span svg{height:13px;margin-right:3px;fill:currentColor;}

.favorite-post-summary{font-size:15px;font-style:italic;}

a.pbpReadMore svg{height:13px;fill:#890000;padding:1px;}
a.pbpReadMore:hover svg {height:15px;padding:0;}

.pbpLoadIcon {border:6px solid #f3f3f3;border-radius:50%;border-top:6px solid #3498db;width:25px;height:25px;animation:dawaj 1s linear infinite;margin:auto;}

@keyframes dawaj {0% {transform: rotate(0deg);} 100% {transform:rotate(360deg);}}`;
	document.head.appendChild(styl);
	
	function pbpFavoritePosts(f, n) {
		if (/in/.test(document.readyState)) {
			setTimeout(function() {
				pbpFavoritePosts(f, n);
			}, 50)
		} else {
			f(n);
		}
	}
	
	function wal() {
		let majn = document.body;
		selMain.forEach(s => {
			if (document.querySelector(s)) majn = document.querySelector(s);
		});
		for (let s=0; s<sel.length; s++) {
			if (majn.querySelector(sel[s])) {
				let posty = majn.querySelectorAll(sel[s]);
				posty.forEach(p => {
					if (!p.querySelector('.pbpFavourite')) {
						let urle = p.querySelectorAll('a[href]');
						if (urle.length) {
							for (let k=0;k<urle.length;k++) {
								let url = urle[k].getAttribute('href').split('?')[0];
								if (url.indexOf(location.protocol + '//' + location.host) === 0 && /.*\/\d{4}\/\d{2}\/.*\.html/.test(url)) {
									pierdolnij(urle[k], url);
									break;
								} else if (k === urle.length - 1) {
									let gorny = lapUrl(p);
									if (gorny) {
										pierdolnij(gorny, gorny.getAttribute('href'));
									}
								}
							}
						} else {
							let gorny = lapUrl(p);
							if (gorny) {
								pierdolnij(gorny, gorny.getAttribute('href'));
							}
						}
					
					}
					
				})
				break;
			} else if (s === sel.length - 1) {
				let zlapane = [];
				urle = majn.querySelectorAll('a[href]');
				urle.forEach(u => {
					let url = u.getAttribute('href').split('?')[0];
					if (url.indexOf(location.protocol + '//' + location.host) === 0 && /.*\/\d{4}\/\d{2}\/.*\.html/.test(url) && zlapane.indexOf(url) < 0) {
						pierdolnij(u, url);
						zlapane.push(url);
					}
				})
			}
		}
	}
	
	pbpFavoritePosts(function(n) {
		
		
		if (/.*\/\d{4}\/\d{2}\/.*\.html/.test(location.href.split('?')[0])) { // post page
			
			let url = location.href.split('?')[0].split('#')[0];
			let majn = document.body;
			selMain.forEach(s => {
				if (document.querySelector(s)) majn = document.querySelector(s);
			});
			for (let s=0; s<sel2.length; s++) {
				if (majn.querySelector(sel2[s])) {
					let tytul = majn.querySelector(sel2[s]);
					pierdolnij(tytul, url);
					break;
				}
			}
			
		} else if (!/.*\/p\/.*\.html/.test(location.href.split('?')[0])) { // index page
		
			wal();
			
			setInterval(function() {
				wal();
			}, 700);
			
		}
		
	}, nr);


})(pbpFavPostsCnt)
