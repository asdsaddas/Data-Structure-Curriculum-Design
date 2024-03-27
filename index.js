//学生人数,初始化为0
let number=0
//保存图数据的矩阵
var G =[];
//最终结果
let htmlResult=''
//矩阵初始化
let maxInt=9999
function start(){
    document.getElementById("inputBlock").style.display="none";
    number=document.querySelector("input").value;
    let html='';
    //中心点横坐标
    var dotLeft = parseInt(document.getElementById("container").style.width)/2
     - parseInt(document.getElementById("dot").style.width)/2;
    //中心点纵坐标
    var dotTop = parseInt(document.getElementById("container").style.height)/2
     - parseInt(document.getElementById("dot").style.height)/2;
    //起始角度
    var stard = 0;
    //半径
    var radius = 200;
    //每一个BOX对应的角度;
    var avd = 360/number;
    //每一个BOX对应的弧度;
    var ahd = avd*Math.PI/180;
    console.log(dotLeft);
    console.log(ahd);
    //设置圆的中心点的位置
    document.getElementById("dot").style.left=dotLeft + "px";
    document.getElementById("dot").style.top=dotTop + "px";
    for(let i=1;i<=number;i++){
        let left=Math.sin(ahd*i)*radius+dotLeft;
        let top=Math.cos(ahd*i)*radius+dotTop;
       html+=`<div id="div${i}" class='circle' style="position:absolute;left:${left}px;top:${top}px;">${i}</div>`;
    }
    document.getElementById("container").innerHTML+=html;
    let htmlRight=''
    for(let i=1;i<=number;i++){
        htmlRight+=`<span>第${i}位同学选择的三位同学的编号:</span><input id="input${i}" class="p" onchange="changeContent()"><br>`
    }
    htmlRight+="<button onclick='submit()' style='width:405px;text-align:center;'>出结果</button>"
    document.getElementById("inputChoice").innerHTML+=htmlRight;
    document.getElementById("all").style.display="flex";
}
//输入编号时连线
function changeContent(){
    for(let i=1;i<=number;i++){
        if(document.getElementById(`input${i}`).value!=''){
            let arr=document.getElementById(`input${i}`).value.split(' ')
            let index=0
            for(let j=0;j<arr.length;j++){
                if(arr[j]!=""&&arr[j]!=i&&index!=3){
                    index++
                    var canvas = document.getElementById('canvas');
                    var context = canvas.getContext('2d');
                    var element1 = document.getElementById(`div${i}`);
                    var element2 = document.getElementById(`div${arr[j]}`);
                    var rect1 = element1.getBoundingClientRect();
                    var rect2 = element2.getBoundingClientRect();
                    var x1 = rect1.left + rect1.width / 2;
                    var y1 = rect1.top + rect1.height / 2 - parseInt(document.querySelector("span").style.height);
                    var x2 = rect2.left + rect2.width / 2;
                    var y2 = rect2.top + rect2.height / 2 - parseInt(document.querySelector("span").style.height);
                    context.beginPath();
                    context.moveTo(x1, y1);
                    context.lineTo(x2, y2);
                    context.strokeStyle = 'black';
                    context.lineWidth = 2;
                    context.stroke();
                }
            }
        }
    }
}
//提交按钮
function submit(){
    htmlResult=""
    for(var i=0;i<number;i++){        
        G[i] = [];
        for(var j=0;j<number;j++){    
    	    G[i][j] = maxInt;
        }
    }
    for(let i=1;i<=number;i++){
        if(document.getElementById(`input${i}`).value!=''){
            let arr=document.getElementById(`input${i}`).value.split(' ')
            let index=0
            for(let j=0;j<arr.length;j++){
                if(arr[j]!=""&&arr[j]!=i&&index!=3){
                    index++
                    G[i-1][arr[j]-1]=1
                    G[arr[j]-1][i-1]=1
                }
            }
        }else{
            alert("未填充完整")
            break
        }
    }
    for(let i=1;i<=number;i++){
        for(let j=i+1;j<=number;j++){
            DIJ(j-1,i-1)
        }
    }
    document.getElementById("result").innerHTML=htmlResult
    document.getElementById("inputChoice").style.display="none"
    document.getElementById("result").style.display="block"
}
function DIJ(v0, vn) {
    let min1;
    let v;
    let reach = [];
    let d = [];
    let path = []; //数组reach代表已经找到最短路径的点
    for (let i = 0; i < number; i++) //初始化
    {
        reach.push(0)
        d.push(G[v0][i]) //初始最短路径为v0到点的权值
        if (d[i] < maxInt) //v0与i之间有弧，则前驱设为v0
            path.push(v0);
        else //v0与i之间无弧，则前驱设为-1
            path.push(-1);
    }
    reach[v0] = 1; //将v0加入数组reach
    document.getElementById(`div${v0+1}`).classList.add("reach")
    d[v0] = 0; //源点到源点距离为0
    for (let i = 1; i < number; i++) //访问剩下的n-1个点
    {
        min1 = maxInt;
        for (let j = 0; j < number; j++) {
            if (!reach[j] && d[j] < min1) //点不在集合s内且小于最小边
            {
                v = j; //选择一条当前最短路径，终点为v
                min1 = d[j];
            }
        }
        reach[v] = 1; //将v加入集合s
        document.getElementById(`div${v+1}`).classList.add("reach")
        for (let j = 0; j < number; j++) //将v加入集合后，更新从v0到剩余点的最短路
        {
            if (!reach[j] && (d[v] + G[v][j]) < d[j]) //该点不在集合s内且加入v点后最短路径小于之前的最短路径
            {
                d[j] = d[v] + G[v][j]; //更新最短路径
                path[j] = v; //前驱设为v
            }
        }
    }
    let t = vn;
    let pathArray = [];
    while (t != v0) {
        pathArray.push(t);
        t = path[t];
    }
    pathArray.push(v0);
    htmlResult += `${vn+1}点到${v0+1}点的最短路径：${pathArray.map(node => node+1).join(' ')} 最短路径长度:${d[vn]}`;
    htmlResult+="<br>"
}


