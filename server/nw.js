let Service = require('node-windows').Service;
 
    let svc = new Service({
         name: 'bookmanage',    //服务名称
        description: 'bookmanage', //描述
        script: 'D:/nodejs/2.0/GMF_demoV2/server/index.js' //nodejs项目要启动的文件路径
    });
 
  svc.on('uninstall',function(){
      console.log('Uninstall complete.');
      console.log('The service exists: ',svc.exists);
    });
 
  svc.uninstall();
