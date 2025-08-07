export function initCalendar(){
   document.addEventListener("view-change", (event)=>{
        const selectedView  = event.detail.view;

        //show month calendar when selectedView == month
        if(selectedView === "month"){
            console.log("Show month calendar");
        }else{
            console.log("Hide month calendar");
        }
        
   })
    
}