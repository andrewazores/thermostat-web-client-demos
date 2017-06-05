/**
 * Copyright 2012-2017 Red Hat, Inc.
 *
 * Thermostat is distributed under the GNU General Public License,
 * version 2 or any later version (with a special exception described
 * below, commonly known as the "Classpath Exception").
 *
 * A copy of GNU General Public License (GPL) is included in this
 * distribution, in the file COPYING.
 *
 * Linking Thermostat code with other modules is making a combined work
 * based on Thermostat.  Thus, the terms and conditions of the GPL
 * cover the whole combination.
 *
 * As a special exception, the copyright holders of Thermostat give you
 * permission to link this code with independent modules to produce an
 * executable, regardless of the license terms of these independent
 * modules, and to copy and distribute the resulting executable under
 * terms of your choice, provided that you also meet, for each linked
 * independent module, the terms and conditions of the license of that
 * module.  An independent module is a module which is not derived from
 * or based on Thermostat code.  If you modify Thermostat, you may
 * extend this exception to your version of the software, but you are
 * not obligated to do so.  If you do not wish to do so, delete this
 * exception statement from your version.
 */

class SystemMemoryController {
  constructor (systemInfoService, $scope, $interval, pfUtils) {
    this.svc = systemInfoService;
    this.scope = $scope;

    this.config = {
      chartId: 'memoryChart',
      grid: {y: {show: false}}, // uncomment to add horizontal grid-lines
      point: {r: 1},
      color: {pattern: [pfUtils.colorPalette.blue]},
      legend : {'show': true},
      tooltip: {format: {value: function (value) { return value + '%'; }}},
      axis: {
        x: {
          padding: {
            left: 0
          }
        },
        y: {
          tick: 10
        }
      }
    };

    // control whether or not to show axes & highlight area
    $scope.showXAxis = false;
    $scope.showYAxis = true;
    $scope.areaChart = true;

    $scope.$on('$destroy', () => {
      if (angular.isDefined(this.refresh)) {
        $interval.cancel(this.refresh);
      }
    });

    let numTicks = ['ticks', 1];
    let memData = ['Memory Usage (%)', Math.round(Math.random() * 100)];
    this.update(numTicks, memData);
    this.refresh = $interval(() => this.update(numTicks, memData), 2000);
  }

  update (numTicks, memData) {
    this.svc.getMemoryInfo(this.scope.systemId).then(resp => {
      var usage = Math.round(resp.data.response.used / resp.data.response.total * 100);
      memData.push(usage);
      numTicks.push(memData.length - 1);
      this.data = {
        xData: numTicks,
        yData0: memData
      };
    });
  }
}

export default angular.module('systemMemory.controller',
  [
    'systemInfo.service'
  ]
).controller('systemMemoryController', SystemMemoryController);
