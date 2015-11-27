/**
 * Created by eolt on 05.10.2015.
 */
angular
    .module("screenSizeMonitor", [])
    .value("screenSizeMonitorSettings", { resizeDelay: 500 })
    .factory('screenSizeMonitor', ['$window', '$log', 'screenSizeMonitorSettings', '$rootScope',
        function($window, $log, screenSizeMonitorSettings, $rootScope){

        function trace(message){
            $log.debug('screenSizeMonitor >> ' + message);
        }

        var handlers = [];

        var windowElem = angular.element($window);

        function getW(){
            return windowElem.width();
        }
        function getH(){
            return windowElem.height();
        }

        function compareOperation(params){
            var getDimension;
            if(params.dimension == 'h'){
                getDimension = getH;
            }
            else if(params.dimension == 'w'){
                getDimension = getW;
            }
            else {
                throw 'screenSizeMonitor >> unknown dimension" ' + params.dimension + ' "';
            }

            var me = this;
            var predicate;

            switch (params.operator){
                //greater or equal
                case 'ge':
                    predicate = function(){ return getDimension() >= params.value; }
                    break;
                case 'g':
                    predicate = function(){ return getDimension() > params.value; }
                    break;
                //less or equal
                case 'le':
                    predicate = function(){ return getDimension() <= params.value; }
                    break;
                case 'l':
                    predicate = function(){ return getDimension() < params.value; }
                    break;
                case 'e':
                    predicate = function(){ return getDimension() == params.value; }
                    break;
                default:
                    throw 'screenSizeMonitor >> unknown operator" ' + operator + ' "';
            }
            me.execute = predicate;
            return me;
        }


        function resize(){
            angular.forEach(handlers, function(h){
                h.handlerWrap();
            });
        }

        var debounceResize = _.debounce(resize, screenSizeMonitorSettings.resizeDelay);
        windowElem.on('resize', debounceResize)

       return {
           on: function(handler, options){
               var coParamsArray = options.compareOperations;
               var compareOperations = _.map(coParamsArray, function(cop){
                   return new compareOperation(cop);
               });

               function handlerWrap(){
                   if(!_.some(compareOperations, function(co){
                           return !co.execute();
                   })) {
                       $rootScope.$apply(handler);
                   }
               }

               handlers.push({
                   handlerWrap: handlerWrap,
                   originHandler: handler
               })

           },

           off: function(handler){
               var indexes = [];
               angular.forEach(handlers, function(h, i){
                   if(h.originHandler ==  handler){
                       indexes.push(i);
                   }
               });

               angular.forEach(indexes, function(index){
                   handlers.splice(index, 1);
                   trace('remove handler');
               });
           }
       }
    }]);