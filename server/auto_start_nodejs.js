let Service = require('node-windows').Service;
 
     let svc = new Service({
        name: 'bookmanage',    //服务名称
        description: 'bookmanage', //描述
        script: 'D:/代码/GMF_demoV2 - 副本/GMF_demoV2/server/index.js' //nodejs项目要启动的文件路径
    });
 
    svc.on('install', () => {
        svc.start();
    });
	
    svc.install();




