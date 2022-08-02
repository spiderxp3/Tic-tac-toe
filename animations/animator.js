
const animator=(cells)=>{
    let i = 0
    let int 
    wipecell = ()=>{
        if(i==0){
            cells[i].textContent = ""
            cells[i].classList.add("wipe")
            cells[i].dataset.status = ""
            i++
        }else if(i>cells.length-1){
            cells[i-1].classList.remove("wipe")
            i=0
            clearInterval(int)
        }else{
            cells[i].textContent = ""
            cells[i].classList.add("wipe")
            cells[i].dataset.status = ""
            cells[i-1].classList.remove("wipe")
            i++
        }
    }
    const wiperows =()=>{
        const rows= [
            [cells[0], cells[1], cells[2]],
            [cells[3], cells[4], cells[5]], 
            [cells[6], cells[7], cells[8]],
            [[1],[2],[3]]]
        if(i==0){
            rows[i].forEach(cell=>{
                cell.textContent = ""
                cell.classList.add("wipe")
                cell.dataset.status = ""
            })
                i++
        }else if(i==rows.length-1){
            rows[i-1].forEach(cell=>{
                cell.classList.remove("wipe")
            })
            i=0
            clearInterval(int)
        }
        else{

            rows[i].forEach(cell=>{
                cell.textContent = ""
                cell.classList.add("wipe")
                cell.dataset.status = ""
            })
            rows[i-1].forEach(cell=>{
                cell.classList.remove("wipe")
            })
            i++
        }

    }
    const wipecols =()=>{
        const cols= [
            [cells[0], cells[3], cells[6]],
            [cells[1], cells[4], cells[7]], 
            [cells[2], cells[5], cells[8]],
            [[1],[2],[3]]]
        if(i==0){
            cols[i].forEach(cell=>{
                cell.textContent = ""
                cell.classList.add("wipe")
                cell.dataset.status = ""
            })
                i++
        }else if(i==rows.length){
            cols[i-1].forEach(cell=>{
                cell.classList.remove("wipe")
            })
            i=0
            clearInterval(int)
        }
        else{
            cols[i].forEach(cell=>{
                cell.textContent = ""
                cell.classList.add("wipe")
                cell.dataset.status = ""
            })
            cols[i-1].forEach(cell=>{
                cell.classList.remove("wipe")
            })
            i++
        }
    }
    /* const vertical = ()=>{
        return int = setInterval(wiperows, 100)
    } */
    const horizontal=()=>{
        int =setInterval(wipecols, 100)
    }
    const start = ()=>{
        int = setInterval(wipecell, 100)
    }
    let origColor
    function wincolor(object){
        if(object.style.color!="black"){
            origColor = object.style.color
            object.style.color ="black"
        }else if(object.style.color="black"){
            object.style.color = origColor
        }
    }
    const onesec = (object)=>{
        clearInterval(int)
        object.style.color = "origColor"
        console.log(object)
        console.log(origColor)
        console.log("again")
    }
    function winner(object){
        int = setInterval(wincolor, 100, object)
        setTimeout(onesec,830, object)

    }

    return{horizontal, start, winner, wincolor}
}


function test(){
    if(cells[0].classList.contains("wipe")){
        cells[0].classList.remove("wipe")
    }else{
        cells[0].classList.add("wipe")
    }
}
