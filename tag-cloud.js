pbpTagCloud = typeof pbpTagCloud == 'undefined' ? 0 : pbpTagCloud+1;

(function(nr, skryptSRC) {
	let wszysTagi = [];
	let posTagi = [];
	let elem = document.createElement('div');
	let znaki = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890_-';
	let d = 'pbpTC-';
	while (d.length < 16) {
		d += znaki[Math.floor(Math.random() * znaki.length)];
	}
	elem.id = d;
	let skrypt = document.querySelectorAll(skryptSRC)[nr];
	skrypt.parentNode.insertBefore(elem, skrypt);
	
	let textSize = Number(skrypt.getAttribute('textSize'));
	if (textSize < 1 || isNaN(textSize)) textSize = 16;
	
	let display = skrypt.getAttribute('display');
	if (display !== 'list' && display !== 'cloud') display = 'inline';
	
	let searchText = skrypt.getAttribute('searchText') ? skrypt.getAttribute('searchText') : 'Search';
	
	let combining = skrypt.getAttribute('combining') === 'false' ? false : true;
	
	let showCounter = skrypt.getAttribute('showCounter') === 'false' ? false : true;
	
	if (combining) {
		let dv = document.createElement('div');
		dv.style.textAlign = display === 'list' ? 'left' : 'center';
		var szukacz = document.createElement('span');
		szukacz.setAttribute('class', 'pbpTC_searchButton unactive');
		szukacz.innerHTML = searchText + ' (';
		var ileZnal = document.createElement('span');
		ileZnal.textContent = '0';
		szukacz.appendChild(ileZnal);
		szukacz.appendChild(document.createTextNode(')'));
		let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svg.setAttribute('viewBox', '0 0 448 512');
		let sciezka = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		sciezka.setAttribute('d', 'M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z');
		svg.appendChild(sciezka);
		szukacz.appendChild(svg);
		szukacz.onclick = function() {
			if (!this.classList.contains('unactive')) {
				let url = '/search/label/';
				elem.querySelectorAll('input[type="checkbox"]:checked').forEach((lab, i) => {
					url += (i > 0 ? '+' : '') + lab.value;
				});
				location.href = url;
			}
		}
		dv.appendChild(szukacz);
		skrypt.parentNode.insertBefore(dv, skrypt);
	}
	
	let styl = document.createElement('style');
	styl.innerHTML = '#' + d + ' div.pbpLabel{margin:3px 5px;' + (display !== 'list' ? 'display:inline-block;' : '') + '} .pbpTC_searchButton{display:inline-flex;align-items:center;font-size:' + textSize + 'px;padding:3px 7px;background:#949494;border-width:3px;border-style:outset;border-color:#9e9e9e;border-radius:5px;cursor:pointer;} .pbpTC_searchButton:not(.unactive):hover{background:#b2b2b2;border-color:#bcbcbc;} .pbpTC_searchButton:not(.unactive):active{border-style:inset;padding:5px 5px 1px 9px;} .pbpTC_searchButton.unactive {background:#818181;border:3px solid #818181;} .pbpTC_searchButton svg{height:' + textSize + 'px;margin-left:4px;}';
	document.head.appendChild(styl);

	function lapWszystko(f) {
		let wpisy = f.responseXML.getElementsByTagName('entry');
		for (let q=0; q<wpisy.length; q++) {
			let kategorie = [];
			wpisy[q].querySelectorAll('category').forEach(e => {
				let kat = e.getAttribute('term');
				kategorie.push(kat);
				let ten = wszysTagi.filter(a => a.k === kat);
				if (ten.length > 0) {
					ten[0].i++
				} else {
					wszysTagi.push({
						k : kat,
						i : 1
					});
				}
			});
			posTagi.push(kategorie);
		}
	}

	function zapyt(start, maks) {
		let zapko = new XMLHttpRequest();
		zapko.open('GET', '/feeds/posts/summary?start-index=' + start + '&max-results=' + maks);
		zapko.onload = function() {
			if (zapko.status === 200) {
				iloscWszystkich = Number(zapko.responseXML.getElementsByTagName('openSearch\:totalResults')[0].textContent);
				lapWszystko(zapko);
			}
			if (start + maks - 1 < iloscWszystkich) {
				zapyt(start + 150, maks)
			} else {
				gotowosc(wszysTagi);
			}
		}
		zapko.send();
	}

	function wyswietl(sort, typ) {
		while (elem.firstChild) {
			elem.removeChild(elem.firstChild);
		}
		wszysTagi.sort((a, b) => sort === 'popularity' ? b.i - a.i : a.k.localeCompare(b.k));
		wszysTagi.forEach(t => {
			let div = document.createElement('div');
			div.setAttribute('class', 'pbpLabel')
			if (combining) {
				let czek = document.createElement('input');
				czek.type = 'checkbox';
				czek.value = t.k;
				czek.oninput = function() {
					let zazny = elem.querySelectorAll('input[type="checkbox"]:checked');
					if (zazny.length) {
						szukacz.classList.remove('unactive');
						let licznik = 0;
						for (let i=0; i<posTagi.length; i++) {
							let czy = true;
							for (let j=0; j<zazny.length; j++) {
								if (posTagi[i].indexOf(zazny[j].value) < 0) {
									czy = false;
								}
							}
							if (czy) licznik++;
						}
						ileZnal.textContent = licznik;
					} else {
						szukacz.classList.add('unactive');
						ileZnal.textContent = '0';
					}
				}
				div.appendChild(czek);
			}
			let a = document.createElement('a');
			a.href = '/search/label/' + t.k;
			a.textContent = t.k + (showCounter ? ' (' + t.i + ')' : '');
			div.appendChild(a);
			elem.appendChild(div);
		});
	
	}

	function gotowosc(e) {
		wyswietl('alphabetically', 'inline')
	}

	zapyt(1, 150);

})(pbpTagCloud, 'script[src="https://probloggerplugins.github.io/widgets/tag-cloud.js"]');
