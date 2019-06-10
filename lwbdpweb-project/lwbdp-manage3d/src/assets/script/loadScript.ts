export function loadScript() {
    return new Promise((resolve, reject) => {
        let newScript: HTMLScriptElement;
        newScript = document.createElement('script');
        newScript.src = 'http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.js';
        document.head.appendChild(newScript);
        newScript.onload = () => {
            resolve(window);
        };
    });
}
