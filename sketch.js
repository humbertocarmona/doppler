
var S1;
var xf, yf;
var vf = 0.0;
var t, dt = 1.0/60;
var T = 20*dt;
var xd, yd;
var vd = 0.0;

var visible = false;
var gui

var vsound = 70.0;
var runButton, resetButton;
var playing;
var conta = 0;
var sconta = 0;
var crossed = false;

class WaveFront{
	constructor(x,y,t0){
		this.x = x;
		this.y = y;
		// this.vx = 0;
		// this.vy = 0;
		this.t0 = t0;
		this.vs = vsound;
		this.alpha = 255;
		this.alpha2 = 255;

		this.diam = 0.0;
	}
	update(t){
		// this.x = this.x + this.vx*dt;
		// this.y = this.y + this.vy*dt;
		this.diam += 2*this.vs*dt;
		this.alpha = 255/(1+sqrt(0.02*this.diam));
		this.alpha2 = min(0,255 - 2*this.vsound*dt);
	}
	show(){
		
		strokeWeight(2);
		stroke(255,0,0,this.alpha);
		noFill();
		ellipse(this.x,this.y, this.diam,this.diam);
		

		strokeWeight(0);
		stroke(0,0,0,this.alpha);
		fill(0,0,0,this.alpha);
		ellipse(this.x,this.y, 5,5);
		
	}
	finished(){
		return this.alpha < 35;
	}

	frontCrosses(xd,yd){
		if (! this.crossed){
			let dx2 = (this.x-xd)*(this.x-xd); 
			let dy2 = (this.y-yd)*(this.y-yd);
			let r2 = 0.25*this.diam*this.diam
			this.crossed = r2 >= (dx2 + dy2);
			return this.crossed
		}
		return false;
	}
}

function initialize(){
	background(233);
	S1 = [];
	t = 0;
	xf = 0.1*width;
	yf = 0.5*height;
	
	xd = 0.5*width;
	yd = 0.75*height;
	
	console.log(T/dt)
	noLoop();
	playing = false;
	conta = 0;
}

function togglePlaying(){
	playing = !playing;
	if (playing) loop();
	else noLoop();
}


function setup() {
	createCanvas(800, 600);
	initialize();

	gui = createGui();
	sliderRange(10*dt, 30*dt, 5*dt);
	gui.addGlobals('T');

	sliderRange(0, 100, 10);
	gui.addGlobals('vf');
	
	runButton = createButton("play");
	runButton.mousePressed(togglePlaying);

	resetButton = createButton("reset");
	resetButton.mousePressed(initialize);
	
	runButton = createButton("controls");
	runButton.mousePressed(toggleControls);

	gui.hide();
}

function toggleControls(){
	visible = !visible;
	if (visible) gui.show();
	else gui.hide();
}

function draw() {
	background(233);

		
	xf = xf + vf*dt;

	var Ti = int(T/dt)

	if (frameCount % Ti === 0 ) {
		let wf = new WaveFront(xf, yf, t);
		S1.push(wf);
	}


	fill(0);
	textSize(12);
	ellipse(xf,yf, 3,3);
	text('F', xf-1, yf-5);
	

	fill(0,100,0,100);
	ellipse(xd,yd, 20,20);
	fill(0,0,0,255);
	textSize(12);
	textAlign(CENTER, CENTER);
	text('D', xd, yd+1);


	for (let i=S1.length-1; i >=0 ; i--){
		S1[i].show();

		if (S1[i].frontCrosses(xd, yd)){
			conta += 1;
		}

		if (S1[i].finished()){
			S1.splice(i,1)
		}
		S1[i].update(t);
	}


	strokeWeight(0);
	fill(0,100,0);
	textSize(12);
	text('fo = '+ round(10/T)/10 + ', f\' = '+sconta, 40, height-20);
	if (frameCount % 120 == 0){
		sconta = conta/2;
		conta = 0;
	}

	t += dt ;
	t = round(t*100)/100;


} 

