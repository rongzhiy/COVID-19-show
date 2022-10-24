(function flexible(window,document){
   // 获取html的根元素
   var docEl = document.documentElement;
   // dpr 物理像素比  window.devicePixelRatio 会获取当前屏幕的物理像素比，如果是pc端则为1，移动端为2。
   // 如果当前浏览器没有window.devicePixelRatio则取1
   var dpr = window.devicePixelRatio || 1;

   // 设置body的字体大小
   function setBodyFontSize(){
    // 如果页面有body这个元素，就设置body的字体大小
    if (document.body){
        document.body.style.fontSize = (12 * dpr) + 'px';
    }else{
        //否则，等待页面的主要DOM元素加载完毕再去设置body的字体大小
        document.addEventListener("DOMContentLoaded",setBodyFontSize);
    }
   }
   setBodyFontSize();

   // 核心
   // 设置html的文字大小
   function setRemUnit(){
    // 将html文档宽度划分为24等分，每一等分为一rem，即html的fontsize
    
    var rem = docEl.clientWidth / 24;
    // console.log(rem);
    docEl.style.fontSize = rem + 'px';
   }
   setRemUnit();
   // 当页面尺寸大小发生变化时，要重新设置rem的大小
   window.addEventListener('resize',setRemUnit);
   // pageshow 是我们重新加载页面触发的事件
   window.addEventListener('pageshow',function(e){
    if(e.persisted){
        // 返回的是true，说明这个页面是从缓存中去过来的页面，也需要重新计算一下rem的大小
        setRemUnit();
    }
   })

   // 下面这块不必了解
   // detect 0.5px supports  // 有些移动端浏览器不支持0.5像素的写法，下面这个解决方案可以让其支持
   if(dpr >= 2){
    var fakeBody = document.createElement('body');
    var testElement = document.createElement('div');
    testElement.style.border = '.5px solid transparent';
    fakeBody.appendChild(testElement);
    docEl.appendChild(fakeBody)
    if(testElement.offsetHeight === 1){
        docEl.classList.add('hairlines')
    }
    docEl.removeChild(fakeBody)
   }
}(window,document))