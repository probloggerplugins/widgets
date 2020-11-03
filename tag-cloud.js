pbpTagCloud = typeof pbpTagCloud == 'undefined' ? 0 : pbpTagCloud+1;

(function(nr, skryptSRC) {

	let wszysTagi = [];
	let posTagi = [];
	let elem = document.createElement('div');
	let skrypt = document.querySelectorAll(skryptSRC)[nr];
	skrypt.parentNode.insertBefore(elem, skrypt);

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
			elem.innerHTML += '<span class="">' + t.k + '</span>';
		});
	
	}

	function gotowosc(e) {
		wyswietl('alphabetically', 'inline')
	}

	zapyt(1, 150);

})(pbpTagCloud, 'script[src="https://probloggerplugins.github.io/widgets/tag-cloud.js"]');
