const canvas = document.querySelector("canvas"),
toolBtns = document.querySelectorAll(".tool"),
fillColor = document.querySelector("#fill-color"),
sizeSlider = document.querySelector("#size-slider"),
colorBtns = document.querySelectorAll(".colors .option"),
colorPicker = document.querySelector("#color-picker"),
clearCanvas = document.querySelector(".clear-canvas"),
saveImage = document.querySelector(".save-img"),
ctx = canvas.getContext("2d");  //1 getContext() is a method returns a drawing context on the canvas.

 // globle variables with default value..
let isDrawing = false; //5
let brushWidth = 2; //10
let selectedTool = "brush";
let prevMouseX, prevMouseY, snapshot;
let selectedColor = "#000";



const setCanvasBackground = () =>{
    // setting whople canvas background to white, so the download img background will be white..
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor; // setting fillStyle back to the selectedColor, it'll be the brush color..
}
//4 Let's set width and height to the canvas then it's draw properly..
window.addEventListener("load", ()=>{
    // setting canvas width/ height.. offsetWidth/offsetHeight returns viewable width/height of an element.
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
})

const drawRect = (e) =>{
    
    // if fillColor isn't checked draw a rectangle with border else draw with background.. 
    if(!fillColor.checked){

        //creating rectangle according to the mouse pointer.
       return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY); //  strokeRect() method draws a rectangle (no fill)..
        // It takes strokeRect(X-coordinate, y-coordinate, width, height) for rectangle.

    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
}

const drawCircle =(e) =>{

    ctx.beginPath();  // creating new path to draw circle.

    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY),  2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0,2*Math.PI); // creating circle according to the mouse pointer..
    fillColor.checked ? ctx.fill : ctx.stroke();  // if fillColor is checked fill circle else draw border corcle.
}

const drawTriangle = (e) =>{
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY); // moving triangle to the mouse pointer..
    ctx.lineTo(e.offsetX, e.offsetY);  // creating first line according to the mouse pointer..
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY); // creating bottom line of triangle..
    ctx.closePath(); // closing path of a triangle so the third line draw automatically..
    fillColor.checked ? ctx.fill : ctx.stroke();
}

const drawLine = (e) =>{
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);  // moving line to the mouse pointer..
    ctx.lineTo(e.offsetX, e.offsetY);  // creating line according to the mouse pointer..
    ctx.stroke();
}



const startDraw =(e) =>{ //7
    isDrawing = true;

    prevMouseX = e.offsetX;  // passing current mouseX position as prevMouseX value.
    prevMouseY = e.offsetY;  // passing current mouseY position as prevMouseY value.

    ctx.beginPath(); //9 beginPath() method creating new path to draw... this line fix start to draw from the last stop point..
    ctx.lineWidth = brushWidth; //11 set brush size to line

    //Copying canvas data & passing as snapshot value.. this avoids dragging the image.
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);


    // For choosing colors
    ctx.strokeStyle = selectedColor; // passing selectedColor as stroke style.
    ctx.fillStyle = selectedColor; // pasing selected color as fill style.
}

//3
const drawing = (e) =>{
    if(!isDrawing) return; //6 if isDrawing is false return from here...

    ctx.putImageData(snapshot, 0, 0); // adding copied canvas data on to this canvas..

    if(selectedTool === "brush" || selectedTool === "eraser"){

        // if selected tool is eraser than set strokeStyle to white
        // to paint white color on to the existing canvas content else set the stroke color to selected color.
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;

        ctx.lineTo(e.offsetX, e.offsetY);  // lineTo() method creates a new line.. ctx.lineTo(x-coordinate, y-coordinate)
                // offsetX, offsetY returns x and y coordinate of the mouse pointer;
                // creating line according to the mouse pointer;
    
                ctx.stroke(); // drawing/filling line with color..
    }
    else if (selectedTool === "rectangle"){
        drawRect(e);
    }

    else if(selectedTool === "circle"){
        drawCircle(e);
    }

    else if(selectedTool === "triangle"){
        drawTriangle(e);
    }
    else{
        drawLine(e);
    }
}

// 12
toolBtns.forEach(btn => {
    btn.addEventListener("click", ()=>{  // adding click event to all tool option..

        //13 removing active class from the previous option and adding on current clicked option..
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
        console.log(selectedTool);
    })
})

sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value); // passing slider value as brushSize..

colorBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        selectedColor = (window.getComputedStyle(btn).getPropertyValue("background-color"));

    });
});

colorPicker.addEventListener("change", () => {

    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

clearCanvas.addEventListener("click", () =>{
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clearing whole canvas
    setCanvasBackground();
});

// for download canvas.......
saveImage.addEventListener("click", () =>{
    const link = document.createElement("a"); // creating <a> element..
    link.download = `${Date.now()}.jpg`; // passing current date as link download value..
    link.href = canvas.toDataURL(); // passing canvasData as link href value...  canvas.DataURL() method returns a data URL of the image..
    link.click(); // clicking link to download image
});


canvas.addEventListener("mousemove", drawing);//2
canvas.addEventListener("mousedown", startDraw);//6
canvas.addEventListener("mouseup", ()=>isDrawing = false);//8