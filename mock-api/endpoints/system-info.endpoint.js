function systemInfo (server) {
  server.init('systemInfo');
  server.app.get('/systems/0.0.1/:systemId', function (req, res, next) {
    server.logRequest('system-info', req);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(
      {
        response: [{
          systemId: req.params.systemId,
          hostname: req.params.systemId + '-host.localdomain',
          osName: 'Fedora 24 (Workstation Edition)',
          osKernel: 'Linux 4.10.11-200.fc25.x86_64',
          cpuCount: 4,
          cpuModel: 'GenuineIntel',
          totalMemory: { $numberLong: '16437612544' }
        }]
      }
    ));
    next();
  });
}

module.exports = systemInfo;
