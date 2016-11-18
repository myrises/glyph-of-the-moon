var vers = "0.2.0";
var btnRefresh;
var expFilename = "talisman";
//***********************************************
// --- default values ---
var txtMotto = "Lorem ipsum dolor sit amet, ";
txtMotto += "consectetur adipiscing elit, ";
txtMotto += "sed do eiusmod tempor incididunt ";
txtMotto += "ut labore et dolore magna aliqua.";

var natal = {
	sun: {
		name:   "Sun",
		u:      "\u263c",
		deg:    24,
		sign:   11
	},
	moon: {
		name:   "Moon",
		u:      "\u263e",
		deg:    7,
		sign:   0

	},
	mercury: {
		name:   "Mercury",
		u:      "\u263f",
		deg:    9,
		sign:   0
	},
	venus: {
		name:   "Venus",
		u:      "\u2640",
		deg:    14,
		sign:   10
	},
	mars: {
		name:   "Mars",
		u:      "\u2642",
		deg:    24,
		sign:   9
	},
	jupiter: {
		name:   "Jupiter",
		u:      "\u2643",
		deg:    16,
		sign:   11
	},
	saturn: {
		name:   "Saturn",
		u:      "\u2644",
		deg:    26,
		sign:   7
	},
	uranus: {
		name:   "Uranus",
		u:      "\u2645",
		deg:    25,
		sign:   10
	},
	neptune: {
		name:   "Neptune",
		u:      "\u2646",
		deg:    24,
		sign:   4
	},
	asc: {
		name:   "Ascendant",
		u:      "\u2190",
		deg:    15,
		sign:   9
	}
};

var zodiac = "\u2648 Aries_\u2649 Taurus_\u264a Gemini_\u264b Cancer_\u264c Leo_\u264d Virgo_\u264e Libra_\u264f Scorpio_\u2650 Sagittarius_\u2651 Capricorn_\u2652 Aquarius_\u2653 Pisces".split("_");

var opt = {
	circles: {
		label:   "Show Moon Kamea's Circles",
		checked: false
	},
	signes: {
		label:   "Show zodiac signes",
		checked: false
	},
	planets: {
		label:   "Show natal position of planets",
		checked: false
	},
	natal: {
		label:   "Show only natal figure",
		checked: false
	},
};
//***********************************************
// --- SVG stuff ---
var margin = 
	{
		top:    10, 
		left:   10,
		right:  10, 
		bottom: 10 
	};
var rOuter = 360;
var offsetMotto = 42;
var rMotto = rOuter - offsetMotto;
var rInner = rOuter - 64;
var r2Moon = rInner - 16; // radius of the two moon axis

var width  = 2 * rOuter; 
var height = 2 * rOuter; 

var sideKamea = 2 * (r2Moon - 16);
var q9 = sideKamea / 9;
var rKamea = [
	/*  1st Circle */ q9,
	/*  2nd Circle */ q9 / Math.cos(Math.PI / 4), // 45 degree = Pi / 4 radian
	/*  3rd Circle */ 2 * q9,
	/*  4th Circle */ Math.sqrt(Math.pow(q9, 2) + Math.pow(2 * q9, 2)), // as hypotenuse
	/*  5th Circle */ 2 * q9 / Math.cos(Math.PI / 4),
	/*  6th Circle */ 3 * q9,
	/*  7th Circle */ Math.sqrt(Math.pow(q9, 2) + Math.pow(3 * q9, 2)),
	/*  8th Circle */ Math.sqrt(Math.pow(2 * q9, 2) + Math.pow(3 * q9, 2)),
	/*  9th Circle */ 4 * q9,
	/* 10th Circle */ Math.sqrt(Math.pow(q9, 2) + Math.pow(4 * q9, 2)),
	/* 11th Circle */ 3 * q9 / Math.cos(Math.PI / 4),
	/* 12th Circle */ Math.sqrt(Math.pow(2 * q9, 2) + Math.pow(4 * q9, 2))
];

function setAngle(Deg, Sign) {
	return Deg + 30 * Sign;
};

var point = [];
function SetupPoints() {
	point = [
		{
			// Sun 1st
			angle: setAngle(natal.sun.deg, natal.sun.sign),
			r: rKamea[0],
			u: natal.sun.u
		},
		{
			// Sun 2nd
			angle: setAngle(natal.sun.deg, natal.sun.sign),
			r: rKamea[1],
			u: natal.sun.u
		},
		{
			// Sun 3rd
			angle: setAngle(natal.sun.deg, natal.sun.sign),
			r: rKamea[2],
			u: natal.sun.u
		},
		{
			// Moon
			angle: setAngle(natal.moon.deg, natal.moon.sign),
			r: rKamea[3],
			u: natal.moon.u
		},
		{
			// Mercury
			angle: setAngle(natal.mercury.deg, natal.mercury.sign),
			r: rKamea[4],
			u: natal.mercury.u
		},
		{
			// Venus
			angle: setAngle(natal.venus.deg, natal.venus.sign),
			r: rKamea[5],
			u: natal.venus.u
		},
		{
			// Earth
			angle: (180 + setAngle(natal.sun.deg, natal.sun.sign)) % 360,
			r: rKamea[6],
			u: "\u2641"
		},
		{
			// Mars
			angle: setAngle(natal.mars.deg, natal.mars.sign),
			r: rKamea[7],
			u: natal.mars.u
		},
		{
			// Jupiter
			angle: setAngle(natal.jupiter.deg, natal.jupiter.sign),
			r: rKamea[8],
			u: natal.jupiter.u
		},
		{
			// Saturn
			angle: setAngle(natal.saturn.deg, natal.saturn.sign),
			r: rKamea[9],
			u: natal.saturn.u
		},
		{
			// Uranus
			angle: setAngle(natal.uranus.deg, natal.uranus.sign),
			r: rKamea[10],
			u: natal.uranus.u
		},
		{
			// Neptune
			angle: setAngle(natal.neptune.deg, natal.neptune.sign),
			r: rKamea[11],
			u: natal.neptune.u
		},
		{
			// Ascendant
			angle: setAngle(natal.asc.deg, natal.asc.sign),
			r: rKamea[11],
			u: natal.asc.u
		}
	];
};
SetupPoints();

var idxMoon = 3;
var idxAsc = point.length - 1;

// degrees to radians
function d3Deg2Rad(deg) {
	// -!!!- internally d3.js angles starting from 12 hours (as 0 degree) to clockwise direction
	// -!!!- other word, from natal Sagittarius to Scorpio. Libra etc... 
	return deg * Math.PI / 180;
};
var x = function (Angle, R, IsNatal) {
	return rOuter + R * Math.cos(d3Deg2Rad(Angle) - Math.PI+ (IsNatal ? 0 : Math.PI));
};
var y = function (Angle, R, IsNatal) {
	return rOuter - R * Math.sin(d3Deg2Rad(Angle) - Math.PI + (IsNatal ? 0 : Math.PI));
};

//***********************************************
var svg, defs;

function DrawMotto() {
	// -- outer border ---
	svg.append("circle")
		.attr({
			"class": "border border-thick",
			"cx":    rOuter,
			"cy":    rOuter,
			"r":     rOuter - 2
		});
	svg.append("circle")
		.attr({
			"class": "border border-thin",
			"cx":    rOuter,
			"cy":    rOuter,
			"r":     rOuter - 7
		});
	// --- circular text ---
	svg.append("path")
		.attr({
			"id": "path-motto",
			"d": function () {
				var s = "M" + offsetMotto + "," + rOuter;
				s += "A" + rMotto + "," + rMotto;
				s += " 180 1 1 ";
				s += (2 * rOuter - offsetMotto) + "," + rOuter;
				s += "A" + rMotto + "," + rMotto;
				s += " 180 1 1 ";
				s += offsetMotto + "," + rOuter;
				s += "Z";
				return s;
			}
		})
		.style("display", "none");
	var motto = svg.append("text")
		.attr({
			"class": "motto",
			//"x":            0,
			//"dy":           0,
			"textLength":   2 * Math.PI * rMotto - 20, // with little empty tail
			"lengthAdjust": "spacingAndGlyphs"
		});
	motto.append("textPath")
		.attr({
			"xlink:href": "#path-motto"
		})
		.text(txtMotto);
	// --- inner border ---
	svg.append("circle")
		.attr({
			"class": "border border-thin",
			"cx":    rOuter,
			"cy":    rOuter,
			"r":     rInner + 7
		});
	svg.append("circle")
		.attr({
			"class": "border border-thick",
			"cx":    rOuter,
			"cy":    rOuter,
			"r":     rInner + 2
		});
};

function DrawSignes() {
	var d = [];
	for(var i= 0; i < 12; i++)
		d.push(Math.PI / 6);
	
	// -!!!- internally d3.js angles starting from 12 hours (as 0 degree) to clockwise direction
	// -!!!- other word, from natal Sagittarius to Scorpio. Libra etc... 
	var z = '\u2650_\u264f_\u264e_\u264d_\u264c_\u264b_\u264a_\u2649_\u2648_\u2653_\u2652_\u2651'.split("_");
	
	var arc = d3.svg.arc()
		.outerRadius(rInner)
		.innerRadius(sideKamea / 2);//r2Moon);
	var pie = d3.layout.pie();
	var arcs = svg.selectAll("g.arc")
		.data(pie(d))
		.enter()
		.append("g")
		.attr("class", "zring")
		.attr("transform", "translate(" + rOuter + "," + rOuter + ")");
	arcs.append("path")
		.attr("d", arc);
		
	// labels
	arcs.append("text")
		.attr({
			"class":     "zlabel",
			"transform": function(d) {
				return "translate(" + arc.centroid(d) + ")";
			},
			"dy":        ".35em",
			"text-anchor":   "middle"
		})
		.text(function(d, i) {
			return z[i];
		});
};

function DrawCircles() {
	rKamea.forEach(function(d, i) {
		svg.append("circle")
		.attr({
			"cx":    rOuter,
			"cy":    rOuter,
			"r":     d
		})
		.style({
			"fill": "none",
			"stroke": "blue",
			"stroke-dasharray": "2, 2",
			"stroke-width": "1px"
		});
	});
};

function Draw2MoonAxis() {
	svg.append("path")
		.attr({
			"class": "two-moon-axis",
			"d":     function() {
				var s = "M" + x(point[idxMoon].angle, r2Moon, true) + "," + y(point[idxMoon].angle, r2Moon, true);
				s += "L" + x(point[idxMoon].angle, r2Moon, false) + "," + y(point[idxMoon].angle, r2Moon, false);
				return s;
			}
		});
	svg.append("circle")
		.attr({
			"class": "two-moon-axis",
			"cx":    rOuter,
			"cy":    rOuter,
			"r":     r2Moon
		});
};

function DrawSigil() {
	// --- arc from Neptune to Ascendant ---
	function ascArcAngle(IsNatal) {
		var s = "A" + point[idxAsc].r + "," + point[idxAsc].r + " ";
		var a = point[idxAsc].angle - point[idxAsc - 1].angle;
		a += (a < 0) ? 360 : 0;
		s += a + " " + ((a > 180) ? "1" : "0") + " 0 ";
		s += x(point[idxAsc].angle, point[idxAsc].r, IsNatal) + "," + y(point[idxAsc].angle, point[idxAsc].r, IsNatal);
		return s;
	};

	var figure;
	
	function figureOutput(IsNatal) {
		figure = "M";
		point.some(function(d, i) {
			if(i == idxAsc)
				return true;
			if(i != 0)
				figure += " ";
			figure += x(d.angle, d.r, IsNatal) + " ";
			figure += y(d.angle, d.r, IsNatal);
			return false;
		});
		figure += ascArcAngle(IsNatal);
		// finally move to center
		figure += "L" + rOuter + "," + rOuter;

		svg.append("path")
			.attr({
				"id":                "chart-" + ((IsNatal) ? "natal" : "mirror"),
				"d":                 figure,
				"stroke-linejoin":   "miter",
				"stroke-miterlimit": "24.0",
				"marker-start":      "url(#marker-circle-" + ((IsNatal) ? "natal" : "mirror") + ")",
				"marker-end":        "url(#marker-arrow-"  + ((IsNatal) ? "natal" : "mirror") + ")"
			});
	};
	
	if(!opt.natal.checked)
		figureOutput(false); // mirror figure in background
	figureOutput(true);  // natal figure in foreground
};

function DrawPlanets() {
	svg.selectAll()
		.data(point)
		.enter()
		.append("g")
		.each(function (d, i) {
			if((i != 1) && (i != 2))
			d3.select(this)
				.append("circle")
					.attr({
						"class": "pring",
						"cx":    function(d) {
								return x(d.angle, d.r, true);
							},
						"cy":    function(d) {
								return y(d.angle, d.r, true);
							},
						"r":     16
					});
		})
		.each(function (d, i) {
			if((i != 1) && (i != 2))
			d3.select(this)
				.append("text")
					.attr({
						"class":      "plabel",
						"transform":  function(d) {
								return "translate(" + 
								x(d.angle, d.r, true) + "," +
								y(d.angle, d.r, true) +")"
							},
						"dy":          ".35em",
			            "text-anchor": "middle"
					})
					.text(function(d) {
						return d.u;
					})
		});
};

function MakeSVG() {
	// --- firstly, remove old svg ---
	d3.select("svg")
		.remove();
	// --- create new ---
	svg = d3.select("#talisman")
		.append("svg")
			.attr({
				"version":     "1.1",
				"xmlns":       "http://www.w3.org/2000/svg",
				// hack: doubling xmlns: so it doesn't disappear once in the DOM
				"xmlns:xmlns:xlink": "http://www.w3.org/1999/xlink",
				"width":  width  + margin.left + margin.right,
				"height": height + margin.top + margin.bottom,
				"shape-rendering": "geometricPrecision"
			})
		.append("g")
			.attr("transform", "translate(" + margin.left + ","  + margin.top + ")");

	var embedStyle = d3.select("#embed-style").text();
	svg.append("style")
		.attr("type", "text/css")
		.html("<![CDATA[" + processString(embedStyle) + "]]>");
			
	// --- defs section with line markers ---
	var defs = svg.append("defs");
	// ------ each marker can't change a color :( ------
	defs.append("marker")
		.attr({
			"id":            "marker-arrow-natal",
			"viewBox":       "0 -6 12 12",
			"refX":           12,
			"refY":           0,
			"markerWidth":    24,
			"markerHeight":   24,
			"markerUnits":   "userSpaceOnUse",
			"orient":         "auto"
		})
		.append("path")
		.attr("stroke-linejoin", "miter")
		.attr("stroke-miterlimit", "24")
		.attr("stroke-width", "1")
		.attr("d",            "M0,-6 12,0 0,6 12,0 0,-6");
	defs.append("marker")
		.attr({
			"id":            "marker-arrow-mirror",
			"viewBox":       "0 -6 12 12",
			"refX":           12,
			"refY":           0,
			"markerWidth":    24,
			"markerHeight":   24,
			"markerUnits":   "userSpaceOnUse",
			"orient":         "auto"
		})
		.append("path")
		.attr("stroke-linejoin", "miter")
		.attr("stroke-miterlimit", "24")
		.attr("stroke-width", "1")
		.attr("d",            "M0,-6 12,0 0,6 12,0 0,-6");
	defs.append("marker")
		.attr({
			"id":             "marker-circle-natal",
			"refX":           2,
			"refY":           2,
			"markerWidth":    4,
			"markerHeight":   4,
			"orient":         "auto"
		})
		.append("circle")
		.attr({
			"cx":              2,
			"cy":              2,
			"r":               1  
		});
	defs.append("marker")
		.attr({
			"id":             "marker-circle-mirror",
			"refX":           2,
			"refY":           2,
			"markerWidth":    4,
			"markerHeight":   4,
			"orient":         "auto"
		})
		.append("circle")
		.attr({
			"cx":              2,
			"cy":              2,
			"r":               1  
		});
	// ------ background medalion ------
	svg.append("circle")
		.attr({
			"class": "glyph-circle",
			"cx":    rOuter,
			"cy":    rOuter,
			"r":     rOuter
		});
		
	DrawMotto();
	
	if(opt.circles.checked)
		DrawCircles();

	SetupPoints();

	Draw2MoonAxis();
	if(opt.signes.checked)
		DrawSignes();
	DrawSigil();
	
	if(opt.planets.checked)
		DrawPlanets();
	
	btnRefresh.setAttribute("disabled", "disabled");
};

function Export2SVG() {
	var svgsrc = document.getElementById("talisman").innerHTML;
	var b = new Blob([svgsrc], {type: "image/svg+xml"});
	var a = document.createElement("a");
	a.download = expFilename + ".svg";
	a.innerHTML = "Download";

	if(window.webkitURL != null) {
		// Chrome allows the link to be clicked programmatically.
		a.href = window.webkitURL.createObjectURL(b);
		a.click();
	} 
	else {
			// Firefox requires the user to actually click the link.
			a.href = window.URL.createObjectURL(b);
			// this hides it
			a.style.display	= "none";
			//??? a.onclick = document.body.removeChild();
			document.body.appendChild(a);
			// now it can be auto clicked like in chrome
			a.click();
		};
};

function Export2PNG() {
	var svgsrc = document.getElementById("talisman").innerHTML;
	var canvas = document.createElement('canvas');
	var context = canvas.getContext("2d");
	canvas.width  = width + margin.left + margin.right;
	canvas.height = height + margin.top + margin.bottom;
	
	var img = new Image;
	img.setAttribute("crossorigin", "anonymous");  // This enables CORS
	// img.src = 'data:image/svg+xml;base64,'+ btoa(svgsrc);
	// function 'btoa' convert correctly "Latin-1' chars only, 
	// see at https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/btoa
	img.src = 'data:image/svg+xml;base64,'+ btoa(unescape(encodeURIComponent(svgsrc)));
	img.onload = function() {
		context.drawImage(img, 0, 0);      
		var canvasdata = canvas.toDataURL("image/png");
		var a = document.createElement("a");
		a.download = expFilename + ".png";
		a.innerHTML = "Download";
		a.href = canvasdata;
		if(window.webkitURL != null) {
			a.click();
		} 
		else {
				// Firefox requires the user to actually click the link.
				//a.href = window.URL.createObjectURL(canvasdata);
				// this hides it
				a.style.display	= "none";
				//??? a.onclick = document.body.removeChild();
				document.body.appendChild(a);
				// now it can be auto clicked like in chrome
				a.click();
			};
	};
	
};
//***********************************************
window.onload = function() {
	document.getElementById("vers").innerHTML = vers;
	
	btnRefresh = document.getElementById("refresh");
	btnRefresh.setAttribute("onclick", "MakeSVG();")
	
	var el = document.getElementById("motto-data");
	el.value = txtMotto;
	el.onchange = function() {
		txtMotto = el.value;
		btnRefresh.removeAttribute("disabled");
	};

	var btnExport = document.getElementById("export2svg");
	btnExport.setAttribute("onclick", "Export2SVG();")
	
	var btnExport = document.getElementById("export2png");
	btnExport.setAttribute("onclick", "Export2PNG();")
	
	var s = "", i = 0;
	for(var key in natal) {
		s += "<tr><td>";
		s += natal[key].u + "</td><td>" + natal[key].name;
		s += "</td><td align='right'><select size='1' " +
			"onchange='natal." + key + ".deg = parseInt(this.options[this.selectedIndex].value,10);btnRefresh.removeAttribute(\"disabled\");' >";
		for(i = 0; i < 30; i++) {
			s += "<option " +
				((i == natal[key].deg) ? "selected " : "") +
				"value='" + i + 
				"'>" + ((i < 10) ? "0" : "") + i + "</option>";
		};
		s += "</td><td>\u00B0</td><td><select size='1' " +
			"onchange='natal." + key + ".sign = parseInt(this.options[this.selectedIndex].value,10);btnRefresh.removeAttribute(\"disabled\");' >";
			
		for(i = 0; i < zodiac.length; i++) {
			s += "<option " +
				((i == natal[key].sign) ? "selected " : "") +
				"value='" + i + "'>" + zodiac[i] + "</option>";
		};
		s += "</td></tr>";
	};
	document.getElementById("natal-data").innerHTML = s;
	
	s = "";
	i = 0;
	for(var key in opt) {
		s += "<tr><td>";
		s += "<input id='opt-" + key +"' type='checkbox' " +
			(opt[key].checked ? "checked " : "") +
			"value='" + i + "' " +
			"onchange='opt." + key + ".checked = this.checked;btnRefresh.removeAttribute(\"disabled\");' >";
		s += "</td><td><label>" + opt[key].label;
		s += "</label></td></tr>";
		i++;
	};
	document.getElementById("options").innerHTML = s;

	MakeSVG();
};
