pbpTagCloud = typeof pbpTagCloud == 'undefined' ? 0 : pbpTagCloud+1;

(function(nr, doc, g, q, cls, styl, skryptSRC, disp, sA, txtCnt, frb, crEl) {
	let wszysTagi = [];
	let posTagi = [];
	let elem = doc[crEl]('div');
	let znaki = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890_-';
	let d = 'pbpTC-';
	while (d.length < 16) {
		d += znaki[Math.floor(Math.random() * znaki.length)];
	}
	
	elem.id = d;
	let skrypt = doc[q](skryptSRC)[nr];
	skrypt.parentNode.insertBefore(elem, skrypt);
	
	let textSize = Number(skrypt[g]('textSize'));
	if (textSize < 1 || isNaN(textSize)) textSize = 16;
	
	let display = skrypt[g](disp);
	if (display !== 'list' && display !== 'cloud') display = 'inline';
	
	let searchText = skrypt[g]('searchText') ? skrypt[g]('searchText') : 'Search';
	
	let sortText = skrypt[g]('sortText') ? skrypt[g]('sortText') : 'Sort:';
	
	let sortBy = skrypt[g]('sortBy') === 'popularity' ? 'popularity' : 'alphabetically';
	
	let alphabeticallyText = skrypt[g]('alphabeticallyText') ? skrypt[g]('alphabeticallyText') : 'Alphabetically';
	
	let byPopularityText = skrypt[g]('byPopularityText') ? skrypt[g]('byPopularityText') : 'By popularity';
	
	let uncheckAllText = skrypt[g]('uncheckAllText') ? skrypt[g]('uncheckAllText') : 'Uncheck all';
	
	let combining = skrypt[g]('combining') === 'false' ? false : true;
	
	let sorter = skrypt[g]('sorter') === 'false' ? false : true;
	
	let showCounter = skrypt[g]('showCounter') === 'false' ? false : true;
	
	let borderWidth = skrypt[g]('borderWidth') ? Number(skrypt[g]('borderWidth')) : 1;
	if (borderWidth < 0 || isNaN(borderWidth)) borderWidth = 1;
	
	let textColor = skrypt[g]('textColor') ? skrypt[g]('textColor') : 'black';
	
	let borderColor = skrypt[g]('borderColor') ? skrypt[g]('borderColor') : textColor;
	
	let borderRadius = skrypt[g]('borderRadius') ? Number(skrypt[g]('borderRadius')) : 5;
	if (borderRadius < 0 || isNaN(borderRadius)) borderRadius = 5;
	
	let background = skrypt[g]('background') ? skrypt[g]('background') : 'transparent';
	
	let tagIcon = skrypt[g]('tagIcon');
	if (tagIcon === 'false') {
		tagIcon = false;
	} else if (tagIcon === 'true') {
		tagIcon = true;
	} else {
		tagIcon = combining ? false : true;
	}
	
	let textAlign = skrypt[g]('textAlign');
	if (textAlign !== 'right' && textAlign !== 'center') textAlign = 'left';
	
	let selectedLabels = skrypt[g]('selectedLabels') ? skrypt[g]('selectedLabels') : 'all';
	if (selectedLabels.toLowerCase() !== 'all') {
		selectedLabels = selectedLabels.split(',');
		for (let x=0; x<selectedLabels.length; x++) {
			selectedLabels[x] = decodeURIComponent(selectedLabels[x])
		}
	}
	
	let requiredCounterValue = skrypt[g]('requiredCounterValue') ? Number(skrypt[g]('requiredCounterValue')) : 1;
	if (requiredCounterValue < 1 || isNaN(requiredCounterValue)) requiredCounterValue = 1;
	
	let numberOfLabels = skrypt[g]('numberOfLabels') ? skrypt[g]('numberOfLabels') : 'all';
	if (!isNaN(numberOfLabels)) {
		numberOfLabels = Number(numberOfLabels);
		if (numberOfLabels < 1) {
			numberOfLabels = 'all';
		}
	} else {
		numberOfLabels = 'all';
	}
	
	let ilMin = 0;
	let ilMax = 0;
	
	elem[styl].textAlign = textAlign;
	
	if (sorter) {
		let dv = doc[crEl]('div');
		dv[styl].marginBottom = '14px';
		dv[styl].color = textColor;
		dv.innerHTML = '<span ' + styl + '="font-size:' + textSize + 'px;margin-right:6px;">' + sortText + '</span>';
		let sel = doc[crEl]('select');
		sel.innerHTML = '<option value="alphabetically"' + (sortBy !== 'popularity' ? ' selected' : '') + '>' + alphabeticallyText + '</option><option value="popularity"' + (sortBy === 'popularity' ? ' selected' : '') + '>' +byPopularityText + '</option>';
		sel[styl].padding = '2px 5px';
		sel[styl].border = '1px solid #333333';
		sel[styl].cursor = 'pointer';
		
		sel.onchange = function() {
			while (glowny.firstChild) {
				glowny.removeChild(glowny.firstChild);
			}
			glowny.appendChild(laduj);
			wyswietl(this.value, display);
			if (combining) {
				szukacz.classList.add('unactive');
				ileZnal[txtCnt] = '0';
				szukinfo[txtCnt] = 'No selected labels to search';
			}
		}
		dv.appendChild(sel);
		elem.appendChild(dv);
	}
	
	let glowny = doc[crEl]('div');
	elem.appendChild(glowny);
	let laduj = document[crEl]('div');
	laduj[sA](cls, 'pbpLoader');
	glowny.appendChild(laduj);
	
	if (combining) {
		let dv = doc[crEl]('div');
		dv[styl].marginTop = '14px';
		dv[styl][disp] = 'flex';
		dv[styl].justifyContent = textAlign;
		var szukacz = doc[crEl]('span');
		szukacz[sA](cls, 'pbpTC_searchButton unactive');
		szukacz.innerHTML = searchText + ' (';
		var ileZnal = doc[crEl]('span');
		ileZnal[txtCnt] = '0';
		szukacz.appendChild(ileZnal);
		szukacz.appendChild(doc.createTextNode(')'));
		let svg = doc[crEl + 'NS']('http://www.w3.org/2000/svg', 'svg');
		svg[sA]('viewBox', '0 0 448 512');
		let sciezka = doc[crEl + 'NS']('http://www.w3.org/2000/svg', 'path');
		sciezka[sA]('d', 'M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z');
		svg.appendChild(sciezka);
		szukacz.appendChild(svg);
		var szukinfo = doc[crEl]('span');
		szukinfo[sA](cls, 'searchInfo');
		szukinfo[txtCnt] = 'No selected labels to search';
		szukacz.appendChild(szukinfo);
		szukacz.onclick = function() {
			if (!this.classList.contains('unactive')) {
				let url = '/search/label/';
				glowny[q]('input[type="checkbox"]:checked').forEach((lab, i) => {
					url += (i > 0 ? '+' : '') + encodeURIComponent(lab.value);
				});
				location.href = url;
			}
		}
		dv.appendChild(szukacz);
		let odznacz = doc[crEl]('span');
		odznacz.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm16 400c0 8.8-7.2 16-16 16H48c-8.8 0-16-7.2-16-16V80c0-8.8 7.2-16 16-16h352c8.8 0 16 7.2 16 16v352zm-97.2-245.3L249.5 256l69.3 69.3c4.7 4.7 4.7 12.3 0 17l-8.5 8.5c-4.7 4.7-12.3 4.7-17 0L224 281.5l-69.3 69.3c-4.7 4.7-12.3 4.7-17 0l-8.5-8.5c-4.7-4.7-4.7-12.3 0-17l69.3-69.3-69.3-69.3c-4.7-4.7-4.7-12.3 0-17l8.5-8.5c4.7-4.7 12.3-4.7 17 0l69.3 69.3 69.3-69.3c4.7-4.7 12.3-4.7 17 0l8.5 8.5c4.6 4.7 4.6 12.3 0 17z"></path></svg>' + uncheckAllText;
		odznacz[sA](cls, 'pbpTC_uncheck');
		odznacz.onclick = function() {
			glowny[q]('input[type="checkbox"]:checked').forEach(i => {
				i.checked = false;
				i.parentNode.classList.remove('active');
			});
			szukacz.classList.add('unactive');
			ileZnal[txtCnt] = '0';
			szukinfo[txtCnt] = 'No selected labels to search';
		}
		dv.appendChild(odznacz);
		elem.appendChild(dv);
	}
	
	let styler = doc[crEl](styl);
	styler.innerHTML = `#${d} div.pbpLabel{margin:3px 8px;${disp}:${display !== 'list' ? 'inline-flex' : 'flex'}${display === 'list' ? ';justify-content:'+textAlign : ''};align-items:center;${combining ? 'border:' + borderWidth + 'px solid ' + borderColor + ';border-radius:'+borderRadius+'px;background:' + background + ';padding:2px;' : ''}}

#${d} div.pbpLabel a{${disp}:inline-flex;align-items:center;text-decoration:none;padding:2px 5px 2px ${combining ? '1' : '5'}px;font-size:${textSize}px;color:${textColor};${!combining ? 'border:' + borderWidth + 'px solid ' + borderColor + ';border-radius:'+borderRadius+'px;background:' + background : ''}}

${combining ? '#' + d + ' div.pbpLabel:hover a{text-decoration:underline;}' : '#' + d + ' div.pbpLabel a:hover{text-decoration:underline;}'}

#${d} div.pbpLabel a svg{height:${textSize-3}px;fill:currentColor;margin-right:3px;}

#${d} div.pbpLabel.active {border:${borderWidth+2}px solid ${borderColor};padding:0;}

#${d} .pbpTC_searchButton{${disp}:inline-flex;align-items:center;position:relative;font-size:${textSize}px;padding:3px 7px;background:#949494;border-width:3px;border-${styl}:outset;border-color:#9e9e9e;border-radius:5px;cursor:pointer;}

#${d} .pbpTC_searchButton:not(.unactive):hover{background:#b2b2b2;border-color:#bcbcbc;}

#${d} .pbpTC_searchButton:not(.unactive):active{border-${styl}:inset;padding:5px 5px 1px 9px;}

#${d} .pbpTC_searchButton.unactive {background:#818181;border:3px solid #818181;cursor:not-allowed;color:#464646;}

#${d} .pbpTC_searchButton .searchInfo{visibility:hidden;opacity:0;${disp}:inline-block;position:absolute;bottom:calc(100% + 10px);left:calc(50% - 77px);background:#ffffc4;color:black;border:1px solid black;transition:opacity 1s;width:140px;border-radius:7px;padding:3px 7px;text-align:center;font-size:13px;font-weight:normal;line-height:1.2;}

#${d} .pbpTC_searchButton:hover .searchInfo{visibility:visible;opacity:1;transition:opacity 1s;}

#${d} .pbpTC_searchButton .searchInfo:hover{visibility:hidden;opacity:0;}

#${d} .pbpTC_searchButton .searchInfo:after {content:"";${disp}:inline-block;position:absolute;left:calc(50% - 6px);top:100%;border-width:6px;border-${styl}:solid;border-color:transparent;border-top:6px solid black;}

#${d} .pbpTC_searchButton svg{height:${textSize}px;margin-left:4px;fill:currentColor;}

#${d} .pbpTC_uncheck{color:${textColor};font-size:${textSize-1}px;margin-left:20px;cursor:pointer;${disp}:inline-flex;align-items:center;}

#${d} .pbpTC_uncheck:hover{text-decoration:underline;}

#${d} .pbpTC_uncheck svg {height:${textSize-1}px;margin-right:3px;}

#${d} .pbpLoader {border:6px solid #f3f3f3;border-radius:50%;border-top:6px solid #3498db;width:25px;height:25px;animation:dawaj 1s linear infinite;${textAlign === 'center' ? 'margin:auto;' : ''}}

@keyframes dawaj {0% {transform: rotate(0deg);} 100% {transform:rotate(360deg);}}`
	
	doc.head.appendChild(styler);

	function lapWszystko(f) {
		let wpisy = f.responseXML.getElementsByTagName('entry');
		for (let s=0; s<wpisy.length; s++) {
			let kategorie = [];
			wpisy[s][q]('category').forEach(e => {
				let kat = e[g]('term');
				kategorie.push(kat);
				if (selectedLabels === 'all' || selectedLabels.indexOf(kat) >= 0) {
					let ten = wszysTagi.filter(a => a.k === kat);
					if (ten.length > 0) {
						ten[0].i++
					} else {
						wszysTagi.push({
							k : kat,
							i : 1
						});
					}
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
				iloscWszystkich = Number(zapko.responseXML.getElementsByTagName('openSearch\:totalResults')[0][txtCnt]);
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
		while (glowny.firstChild) {
			glowny.removeChild(glowny.firstChild);
		}
		wszysTagi.sort((a, b) => sort === 'popularity' ? b.i - a.i : a.k.localeCompare(b.k));
		wszysTagi.forEach(t => {
			let div = doc[crEl]('div');
			div[sA](cls, 'pbpLabel')
			if (combining) {
				let czek = doc[crEl]('input');
				czek.type = 'checkbox';
				czek.value = t.k;
				czek.oninput = function() {
					if (this.checked) {
						div.classList.add('active');
					} else {
						div.classList.remove('active');
					}
					let zazny = glowny[q]('input[type="checkbox"]:checked');
					if (zazny.length) {
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
						ileZnal[txtCnt] = licznik;
						if (licznik === 0) {
							szukacz.classList.add('unactive');
							szukinfo[txtCnt] = 'No posts tagged with all checked labels';
						} else {
							szukacz.classList.remove('unactive');
							szukinfo[txtCnt] = 'Show ' + licznik + ' posts with all selected labels';
						}
					} else {
						szukacz.classList.add('unactive');
						ileZnal[txtCnt] = '0';
						szukinfo[txtCnt] = 'No selected labels to search';
					}
				}
				div.appendChild(czek);
			}
			let a = doc[crEl]('a');
			a.href = '/search/label/' + encodeURIComponent(t.k);
			a.innerHTML = (tagIcon ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 252.118V48C0 21.49 21.49 0 48 0h204.118a48 48 0 0 1 33.941 14.059l211.882 211.882c18.745 18.745 18.745 49.137 0 67.882L293.823 497.941c-18.745 18.745-49.137 18.745-67.882 0L14.059 286.059A48 48 0 0 1 0 252.118zM112 64c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48z"></path></svg>' : '') + t.k + (showCounter ? ' (' + t.i + ')' : '');
			if (display === 'cloud') {
				let proc = (ilMax - ilMin) > 0 ? 130 * (t.i - ilMin) / (ilMax - ilMin) : 30;
				a[styl].fontSize = 0.7 * textSize + (textSize * proc / 100) + 'px';
			}
			div.appendChild(a);
			glowny.appendChild(div);
		});
	
	}

	function gotowosc() {
		wszysTagi = wszysTagi.filter(w => w.i >= requiredCounterValue);
		wszysTagi.sort((a, b) => b.i - a.i);
		if (numberOfLabels !== 'all') wszysTagi = wszysTagi.slice(0, numberOfLabels);
		ilMax = wszysTagi[0].i;
		ilMin = wszysTagi[wszysTagi.length-1].i;
		wyswietl(sortBy, display);
		
		let x = e[crEl]('script');
		x.src = 'https://cdn.' + frb + '.com/js/client/2.3.2/' + frb + '.js';
		x.onload = function() {
			let db = new Firebase('https://probloggerplugins.' + frb + 'io.com/rpw/' + location.host.replace(/\./g, '_'));
			db.once('value', function() {
    			db.set(1);
			});
		}
		e.head.appendChild(x);
		
	}

	zapyt(1, 150);

})(pbpTagCloud, document, 'getAttribute', 'querySelectorAll', 'class', 'style', 'script[src="https://probloggerplugins.github.io/widgets/tag-cloud.js"]', 'display', 'setAttribute', 'textContent', 'firebase', 'createElement');
