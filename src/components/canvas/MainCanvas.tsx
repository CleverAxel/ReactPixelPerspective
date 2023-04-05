import { useEffect, useRef } from "react"

export default function MainCanvas(){
    const websocket = useRef(new WebSocket("ws://localhost:8000/echo"));
    const idInterval = useRef<any>(null);
    const sizeCanvas = 792;
    const sizePixel = 72;
    const refCanvas = useRef<HTMLCanvasElement>(null);
    const refProgressTxt = useRef<HTMLHeadingElement>(null);
    const refProgressBar = useRef<HTMLDivElement>(null);
    const resetScale = 35;
    // useEffect(() => {
    //     getProgress();
    // }, [])

    const getProgress = () => {
        fetch("http://localhost:8000/progress")
        .then((res) => {
            if(res.ok){
                return res.json();
            }
        })
        .then((json) => {
            if(refProgressTxt.current == null){
                return;
            }
            if(json.progress.from >= json.progress.to){
                refProgressTxt.current.textContent = `${json.progress.from} photos sur ${json.progress.to} 🥳 !`;
            }
            else if(json.progress.from <= 1){
                refProgressTxt.current.textContent = `${json.progress.from} photo sur ${json.progress.to}, plus que ${json.progress.to - json.progress.from} !`;
            }else{
                refProgressTxt.current.textContent = `${json.progress.from} photos sur ${json.progress.to}, plus que ${json.progress.to - json.progress.from} !`;
            }
            setTimeout(() => {
                if(refProgressBar.current){
                    refProgressBar.current.style.transform = `scaleX(${json.progress.percentage}%) translateY(-50%) `;
                }
            });
        })
    }

    useEffect(() => {
        if(!refCanvas.current){
            return;
        }

        getProgress();

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
            getProgress();
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
        return () => {
            if(idInterval != null){
                clearInterval(idInterval.current);
                websocket.current.close();
                websocket.current.removeEventListener("message", getUpdateWebsocket);
                websocket.current.removeEventListener("open", openWebsocket);
            }
        }
    }, [])
    return(
        <>
            <div className="max-w-3xl mx-auto">
                <h3 ref={refProgressTxt} className="text-center text-4xl font-inter uppercase font-black"></h3>
                <div className="w-full h-5 bg-gray-400 relative mt-2 rounded-full">
                    <div ref={refProgressBar} className="origin-left h-3 top-1/2 -translate-y-1/2 transition duration-500 ease-in-out absolute w-[98%] scale-x-0 rounded-full left-0 right-0 mx-auto bg-orange-600"></div>
                </div>
            </div>
            <canvas className="mx-auto" ref={refCanvas} width={sizeCanvas} height={sizeCanvas}>

            </canvas>
        </>
    )
}