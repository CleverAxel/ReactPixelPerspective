import { useEffect, useRef } from "react"

export default function MainCanvas(){
    const websocket = useRef(new WebSocket("ws://localhost:8000/echo"));
    const idInterval = useRef<any>(null);
    const sizeCanvas = 792;
    const sizePixel = 72;
    const refCanvas = useRef<HTMLCanvasElement>(null);
    const resetScale = 30;
    useEffect(() => {
        if(!refCanvas.current){
            return;
        }

        let target = {
            x : 648,
            y : 360,
        };

        let coordinate = {
            x : 0,
            y : 0,
        };

        let scale = resetScale;

        let nbrPixel = 0;
        let newPixelSize = 0;
        let newRatio = 0;
        let pixelImg = new Image();
        let newPhoto = new Image();
        /************************************** */
        const openWebsocket = () => {
            idInterval.current = setInterval(() => {
                websocket.current.send("ping");
            }, 2000);

            
            pixelImg.src = "http://localhost:8000/images/pixelPerspective.png?"+ Date.now().toString();
            pixelImg.onload = () => {
                nbrPixel = pixelImg.width / sizePixel;
                newPixelSize = sizeCanvas / nbrPixel;
                newRatio = pixelImg.width / sizeCanvas;
                ctx?.drawImage(pixelImg, 0, 0, sizeCanvas, sizeCanvas);
            }

            websocket.current.addEventListener("message", getUpdateWebsocket)
            console.log("websocket connected");
        }
        /********************************************* */

        const getUpdateWebsocket = (e:MessageEvent) => {
            let data = JSON.parse(e.data)
            let dataCoord = data.update.coordinate;
            target.x = dataCoord.x / newRatio;
            target.y = dataCoord.y / newRatio;
            let photo = data.update.photo;
            coordinate.x = 0;
            coordinate.y = 0;
            scale = resetScale;
            //reload
            newPhoto.src = photo;
            newPhoto.onload = () => {
                ctx?.drawImage(newPhoto, coordinate.x, coordinate.y, newPixelSize * scale, newPixelSize * scale);
                requestAnimationFrame(animate);
            }
            // ctx?.clearRect(0, 0, sizeCanvas, sizeCanvas);
            // pixelImg.src = "http://localhost:8000/images/pixelPerspective.png?"+ Date.now().toString();
            // pixelImg.onload = () => {
            //     ctx?.drawImage(pixelImg, 0, 0, sizeCanvas, sizeCanvas);

            // }
        }
        /******************************************** */

        const animate = () => {
            ctx?.clearRect(0, 0, sizeCanvas, sizeCanvas);
            ctx?.drawImage(pixelImg, 0, 0, sizeCanvas, sizeCanvas);
            // if(scale > 1){
            //     scale -= 0.02
            // }
        
            if(coordinate.x < target.x){
                coordinate.x += 3;
            }
        
            if(coordinate.x > target.x){
                coordinate.x = target.x;
            }
            if(coordinate.y < target.y){
                coordinate.y += 3;
            }
        
            if(coordinate.y > target.y){
                coordinate.y = target.y;
            }

            if(coordinate.y == target.y && coordinate.x == target.x && scale > 1){
                scale -= 0.1
            }
        
            if(scale < 1){
                scale = 1;
            }
        
            ctx?.drawImage(newPhoto, coordinate.x, coordinate.y, newPixelSize * scale, newPixelSize * scale);
            if(scale > 1 || coordinate.y < target.y || coordinate.x < target.x){
                requestAnimationFrame(animate)
            }else{
                //refresh le canvas depuis l'image du serveur
                pixelImg.src = "http://localhost:8000/images/pixelPerspective.png?"+ Date.now().toString();
                pixelImg.onload = () => {
                    ctx?.clearRect(0, 0, sizeCanvas, sizeCanvas);
                    ctx?.drawImage(pixelImg, 0, 0, sizeCanvas, sizeCanvas);
                }
                
            }
        }

        /****************************** */
        let ctx = refCanvas.current.getContext("2d");
        
        websocket.current.addEventListener("open", openWebsocket);
            
            // pixelImg.onload = () => {
            //     let nbrPixel = pixelImg.width / sizePixel;                
            //     let newPixelSize = sizeCanvas / nbrPixel;
                
            //     let newRatio = pixelImg.width / sizeCanvas;
            //     target.x /= newRatio;
            //     target.y /= newRatio;
                
            //     ctx?.drawImage(pixelImg, 0, 0, sizeCanvas, sizeCanvas);
                
                
            //     let photo = new Image();
            //     photo.src = "/assets/images/photo.png";
            //     photo.onload = () => {
            //         console.log( 9 * newPixelSize);
            //         console.log( 5 * newPixelSize);
            //         ctx?.drawImage(photo, target.x , target.y, newPixelSize, newPixelSize);
            //     }
            // }
        return () => {
            if(idInterval != null){
                console.log("CLEAN UP MAIN CANVAS");
                
                clearInterval(idInterval.current);
                websocket.current.close();
                websocket.current.removeEventListener("message", getUpdateWebsocket);
                websocket.current.removeEventListener("open", openWebsocket);
            }
        }
    }, [])
    return(
        <>
            <canvas className="mx-auto" ref={refCanvas} width={sizeCanvas} height={sizeCanvas}>

            </canvas>
        </>
    )
}