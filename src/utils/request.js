const { net } = window.require('electron').remote;
const { ipcRenderer } = window.require('electron');

function request (urlPath, cb) {
    let req = net.request({
        method: 'POST',
        url: 'https://pysq.shipook.com' + urlPath,
    })
    req.setHeader('Accept-Encoding', 'gzip, deflate, br');
    req.setHeader('Connection', 'keep-alive');
    req.setHeader('Referer', 'https://servicewechat.com/wx89182c780ab47592/68/page-frame.html');
    req.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36 MicroMessenger/7.0.9.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat');
    req.on('response', (response) => {
        response.on('data', (chunk) => {
            cb(response, chunk.toString());
        })
    })
    req.end()
};
export function downloadCurAudio(fileUrl){
    ipcRenderer.send('download', fileUrl);
} 
export default request