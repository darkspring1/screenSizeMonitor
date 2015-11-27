/**
 * Created by eolt on 08.10.2015.
 */

    angular.module('components', ['screenSizeMonitor'])
        .controller('mainCtrl', [ '$scope', 'screenSizeMonitor', function($scope, screenSizeMonitor) {

            function opt(dimension, operator, value) {
                return {
                    compareOperations: [ { dimension: dimension, operator: operator, value: value } ]
                }
            }

            var options = [
                opt('w', 'ge', 500),
                opt('w', 'e', 700),
                opt('w', 'l', 500),
                opt('h', 'l', 500)
            ]

            function coViewModel(params){
                var me = this;
                me.name = JSON.stringify(params.compareOperations);
                me.calls = 0;
                var handler = function(){ me.calls++; };
                me.addHandler = function(){
                    screenSizeMonitor.on(handler, params);
                }
                me.removeHandler = function(){
                    screenSizeMonitor.off(handler);
                }
                me.addHandler();
                return me;
            }


            $scope.viewModels = _.map(options, function(co){
                return new coViewModel(co);
            })

        }])