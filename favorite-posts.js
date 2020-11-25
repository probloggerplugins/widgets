var pbpFavPostsCnt = typeof pbpFavPostsCnt == 'undefined' ? 0 : pbpFavPostsCnt + 1;

(function(nr) {
	
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
		dyw.style.position = 'relative';
		let ul = document.createElement('span');
		ul.setAttribute('class', 'pbpFavourite');
		let inf = document.createElement('span');
		inf.setAttribute('class', 'pbpFavInfo');
		document.body.appendChild(inf);
		if (ulubiene.indexOf(url) < 0) {
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
				ulubiene = ulubiene.filter(u => u !== url);
			} else {
				this.setAttribute('active', 'true');
				inf.textContent = 'Added';
				setTimeout(function() {
					inf.textContent = 'Remove from favorites';
				}, 1000);
				if (ulubiene.indexOf(url) < 0) ulubiene.push(url);
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
		if (getComputedStyle(gdzie.parentNode).position === 'static') gdzie.parentNode.style.position = 'relative';
		dyw.appendChild(ul);
		gdzie.parentNode.insertBefore(dyw, gdzie);
	}
	
	let ulubiene = [];
	if (localStorage.pbpFavorites) {
		ulubiene = JSON.parse(localStorage.pbpFavorites);
	} else {
		localStorage.pbpFavorites = '[]';
	}
		
	let wyrPrawX = 15;
	let wyrLewX = 7;
	let wyrDolY = 12;
	let wyrGorY = 0;
		
	let sel = ['.post', '.post-outer', 'article', '.item', '.blog-post', '.hentry', '.index-post'];
	let sel2 = ['.post-title', 'h1', 'h2', 'h3'];
	
	let skrypt = document.querySelectorAll('script[src="https://probloggerplugins.github.io/widgets/favorite-posts.js"]')[nr];
	
	let iconSize = Number(skrypt.getAttribute('iconSize'));
	if (iconSize < 8 || isNaN(iconSize)) iconSize = 20;
	
	let favoritePostsText = skrypt.getAttribute('favoritePostsText') ? skrypt.getAttribute('favoritePostsText') : 'Favorites Posts';
	
	let showTitle = skrypt.getAttribute('showTitle') === 'false' ? false : true;
	
	let showAuthor = skrypt.getAttribute('showAuthor') === 'false' ? false : true;
	
	let showComments = skrypt.getAttribute('showComments') === 'false' ? false : true;
	
	let showDate = skrypt.getAttribute('showDate') === 'false' ? false : true;
	
	let showLabels = skrypt.getAttribute('showLabels') === 'false' ? false : true;
	
	let showSummary = skrypt.getAttribute('showSummary') === 'false' ? false : true;
	
	let iconType = skrypt.getAttribute('iconType');
	if (iconType !== 'heart' && iconType !== 'star') iconType = 'heart';
	
	
	
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
		
		for (let x=0;x<ulubiene.length;x++) {
			

			let dyw = document.createElement('div');
			body.appendChild(dyw);
			let zap = new XMLHttpRequest();
			zap.open('GET', ulubiene[x]);
			zap.onload = function() {
				if (zap.status === 200) {
					let postId = zap.response.split("'postId':")[1].split("'")[1];
					let zap2 = new XMLHttpRequest();
					zap2.open('GET', '/feeds/posts/summary/' + postId);
					zap2.onload = function() {
						if (zap2.status === 200) {
							let wpis = zap2.responseXML.querySelector('entry');
							
							let obi = {
								't' : wpis.querySelector('title').textContent,
								'd' : wpis.querySelector('published').textContent.substring(0, 10),
								'a' : wpis.querySelector('author').querySelector('name').textContent,
								'k' : Number(wpis.getElementsByTagName('thr\:total')[0].textContent),
								'l' : [],
								's' : wpis.querySelector('summary').textContent.replace(/<(?:.|\n)*?>/gm, '').substring(0, 200),
								'o' : wpis.getElementsByTagName('media\:thumbnail').length ? wpis.getElementsByTagName('media\:thumbnail')[0].getAttribute('url') : 'https://3.bp.blogspot.com/-go-1bJQKzCY/XIpRVUCKeCI/AAAAAAAAAQM/YUdYK3hEkcIFwcz0r-T2uErre0JOJWnrwCLcBGAs/s1600/no-image.png'
								
							}
							
							wpis.querySelectorAll('category').forEach(k => obi.l.push(k.getAttribute('term')));
							
							let dyw2 = document.createElement('div');
							dyw2.setAttribute('class', 'pbpFavPostBox');
							dyw.appendChild(dyw2);
							
							dyw2.innerHTML = '<div class="favorite-post-title"><a href="' + ulubiene[x] + '" title="' + obi.t + '">' + obi.t + '</a></div>';
							if (showAuthor || showComments || showDate) dyw2.innerHTML += '<div class="favorite-post-info">';
							if (showAuthor) dyw2.innerHTML += '<span style="display:inline-block;font-size:16px;margin-right:15px;display:inline-flex;align-items:center;cursor:default;" title="Author: ' + obi.a + '"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style="height:14px;margin-right:3px;"><path fill="currentColor" d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path></svg>' + obi.a + '</span>';
							if (showComments) dyw2.innerHTML += '<span style="display:inline-block;font-size:16px;margin-right:15px;display:inline-flex;align-items:center;cursor:default;" title="' + obi.k + ' comments"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="height:14px;margin-right:3px;"><path fill="currentColor" d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32z"></path></svg>' + obi.k + '</span>';
							if (showDate) dyw2.innerHTML += '<span style="display:inline-block;font-size:16px;margin-right:15px;display:inline-flex;align-items:center;cursor:default;" title="Published ' + obi.d + '"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style="height:14px;margin-right:3px;"><path fill="currentColor" d="M148 288h-40c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12zm108-12v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm96 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm-96 96v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm-96 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm192 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm96-260v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h48V12c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h128V12c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h48c26.5 0 48 21.5 48 48zm-48 346V160H48v298c0 3.3 2.7 6 6 6h340c3.3 0 6-2.7 6-6z"></path></svg>' + obi.d + '</span>';
							if (showAuthor || showComments || showDate) dyw2.innerHTML += '</div>';
							if (showLabels) dyw2.innerHTML += '<div>';
							if (showLabels) obi.l.forEach(k => dyw2.innerHTML += '<span style="display:inline-flex;align-items:center;padding:2px 5px;border-radius:5px;margin:5px;background:#9d0000;color:white;cursor:default" title="' + k + '"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="height:13px;margin-right:3px;"><path fill="currentColor" d="M0 252.118V48C0 21.49 21.49 0 48 0h204.118a48 48 0 0 1 33.941 14.059l211.882 211.882c18.745 18.745 18.745 49.137 0 67.882L293.823 497.941c-18.745 18.745-49.137 18.745-67.882 0L14.059 286.059A48 48 0 0 1 0 252.118zM112 64c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48z"></path></svg>' + k + '</span>');
							if (showLabels) dyw2.innerHTML += '</div>';
							if (showSummary) dyw2.innerHTML += '<div style="font-size:15px;font-style:italic;">' + obi.s + '... <a title="Read more" href="' + ulubiene[x] + '" class="pbpReadMore"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34zm192-34l-136-136c-9.4-9.4-24.6-9.4-33.9 0l-22.6 22.6c-9.4 9.4-9.4 24.6 0 33.9l96.4 96.4-96.4 96.4c-9.4 9.4-9.4 24.6 0 33.9l22.6 22.6c9.4 9.4 24.6 9.4 33.9 0l136-136c9.4-9.2 9.4-24.4 0-33.8z"></path></svg></a></div>';
					
						}
					}
					zap2.send();
				}
			}
			zap.send();
			
		}
	}
	
	
	
	let styl = document.createElement('style');
	styl.innerHTML = `
.pbpFavourite{display:inline-block;position:absolute;right:5px;top:5px;width:${iconSize+2}px;height:${iconSize+2}px;background-repeat:no-repeat;background-size:${iconSize}px ${iconSize}px;background-position:1px 1px;cursor:pointer;z-index:99999999;}

.pbpFavourite[active="false"] {background-image:url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="black" d="M458.4 64.3C400.6 15.7 311.3 23 256 79.3 200.7 23 111.4 15.6 53.6 64.3-21.6 127.6-10.6 230.8 43 285.5l175.4 178.7c10 10.2 23.4 15.9 37.6 15.9 14.3 0 27.6-5.6 37.6-15.8L469 285.6c53.5-54.7 64.7-157.9-10.6-221.3zm-23.6 187.5L259.4 430.5c-2.4 2.4-4.4 2.4-6.8 0L77.2 251.8c-36.5-37.2-43.9-107.6 7.3-150.7 38.9-32.7 98.9-27.8 136.5 10.5l35 35.7 35-35.7c37.8-38.5 97.8-43.2 136.5-10.6 51.1 43.1 43.5 113.9 7.3 150.8z"></path></svg>')}

.pbpFavourite[active="true"] {background-image:url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="black" d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"></path></svg>')}

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

.favorite-post-title{margin-bottom:8px;}
.favorite-post-title a{font-size:18px;color:#890000;text-decoration:none;font-family:"Palatino Linotype","Book Antiqua",Palatino,serif;}
.favorite-post-title a:hover{text-decoration:underline;}

a.pbpReadMore svg{height:13px;fill:#890000;padding:1px;}
a.pbpReadMore:hover svg {height:15px;padding:0;}`;
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
	
	pbpFavoritePosts(function(n) {

		let majn = document.querySelector('#main');
		
		
		if (/.*\/\d{4}\/\d{2}\/.*\.html/.test(location.href.split('?')[0])) { // post page
			
			let url = location.href.split('?')[0].split('#')[0];
			for (let s=0; s<sel2.length; s++) {
				if (majn.querySelector(sel2[s])) {
					let tytul = majn.querySelector(sel2[s]);
					pierdolnij(tytul, url);
					break;
				}
			}
			
		} else if (!/.*\/p\/.*\.html/.test(location.href.split('?')[0])) { // index page
		
			for (let s=0; s<sel.length; s++) {
				if (majn.querySelector(sel[s])) {
					let posty = majn.querySelectorAll(sel[s]);
					posty.forEach(p => {
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
		
	}, nr);


})(pbpFavPostsCnt)
