var miApp = angular.module("AngularABM",["ui.router","angularFileUpload",'satellizer']);


miApp.config(function($stateProvider,$urlRouterProvider,$authProvider){

$authProvider.loginUrl = 'Clase.06/ABM_PERSONA/servidor/jwt/php/auth.php';
$authProvider.tokenName = 'TokenNameAxelCores';
$authProvider.tokenPrefix = 'AngularABM';
$authProvider.authHeader = 'data';
$authProvider.httpInterceptor = function() { return true; },
$authProvider.withCredentials = false;
$authProvider.tokenRoot = null;

$authProvider.github({
  url: '/auth/github',
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  redirectUri: window.location.origin,
  optionalUrlParams: ['scope'],
  scope: ['user:email'],
  scopeDelimiter: ' ',
  oauthType: '2.0',
   clientId: 'GitHub Client ID',
  popupOptions: { width: 1020, height: 618 }
});




	$stateProvider
		.state(
			"inicio",{
				url: "/inicio",
				templateUrl: "inicio.html",
				controller:"controlInicio"
			})
			.state(
			"persona",{
				url:"/persona",
				abstract:true,
				templateUrl:"./AbmPersona/abstractaPersona.html"

			})
			.state(
			"persona.menu",{
				url:"/menu",
				views: {
					"contenido":{
					templateUrl:"./AbmPersona/personaMenu.html",
					controller:"controlPersonaMenu"
						}
				}
			})	.state(
			"persona.Alta",{
				url:"/alta",
				views: {
					"contenido":{
					templateUrl:"./AbmPersona/personaAlta.html",
					controller:"controlPersonaAlta"
						}
				}
			}).state(
			"persona.Grilla",{
				url:"/grilla",
				views: {
					"contenido":{
					templateUrl:"./AbmPersona/personaGrilla.html",
					controller:"controlPersonaGrilla"
						}
				}
			}).state(
			"login",{
				url:"/login",
				abstract:true,
				templateUrl:"./formularios/LoginAngular/abstractoLogin.html"

			}).state(
			"login.menu",{
				url:"/menuLogin",
				views: {
					"login":{
					templateUrl:"./formularios/LoginAngular/login.html",
					controller:"controlLogin"
						}
				}
			}).state(
			"login.registro",{
				url:"/registroLogin",
				views: {
					"login":{
					templateUrl:"./formularios/LoginAngular/registro.html",
					controller:"ControlRegistro"
						}
				}
			}).state(
			"sala",{
				url:"/salaDeJuegos",
				abstract:true,
				templateUrl:"./salaDeJuegos/abstractoSala.html"

			}).state(
			"sala.menu",{
				url:"/menuSalaJuegos",
				views: {
					"sala":{
					templateUrl:"./salaDeJuegos/sala.html",
					controller:"controlSalaJuegos"
						}
				}
			}).state(
			"sala.juego1",{
				url:"/juego1",
				views: {
					"sala":{
					templateUrl:"./salaDeJuegos/AdivinaElNumero1.html",
					controller:"controlSalaJuegos"
						}
				}
			}).state(
			"sala.juego2",{
				url:"/juego2",
				views: {
					"sala":{
					templateUrl:"./salaDeJuegos/AdivinaElNumero2.html",
					controller:"controlSalaJuegos"
						}
				}
			}).state(
			"sala.juego3",{
				url:"/juego3",
				views: {
					"sala":{
					templateUrl:"./salaDeJuegos/PiedarPapelTijera1.html",
					controller:"controlSalaJuegos"
						}
				}
			}).state(
			"sala.juego4",{
				url:"/juego4",
				views: {
					"sala":{
					templateUrl:"./salaDeJuegos/PiedarPapelTijera2.html",
					controller:"controlSalaJuegos"
						}
				}
			}).state('modificacion',
	{url: '/modificacion/{id}?:nombre:apellido:dni:foto',
	templateUrl: './AbmPersona/personaModificar.html',
	controller: 'controlModificacion'})






		$urlRouterProvider.otherwise("/inicio");

});


miApp.controller("controlInicio",function($scope){





});



miApp.controller("controlPersonaMenu",function($scope,$state,$auth){

		if(!$auth.isAuthenticated())
		$state.go("login.menu");

		$scope.IraAlta = function(){
		$state.go("persona.Alta");
		}
		$scope.IraGrilla = function(){
			$state.go("persona.Grilla");
		}


			$scope.Desloguear = function(){

				$auth.logout();
				$state.go("login.menu");
			}


});
miApp.controller("controlPersonaAlta",function($scope,$state,FileUploader,$http,$auth){
					$scope.logeado = $auth.getPayload();

			if(!$auth.isAuthenticated())
			$state.go("login.menu");

			//inicio las variables
			$scope.SubirdorArchivos = new FileUploader({url:'./servidor/archivos.php'});  $scope.persona={};
			  $scope.persona.nombre= "natalia" ;
			  $scope.persona.dni= "12312312" ;
			  $scope.persona.apellido= "natalia" ;
			  $scope.persona.foto="pordefecto.png";


			$scope.SubirdorArchivos.onSuccessItem = function(item, response, status, headers) {
			            console.info('onSuccessItem', item, response, status, headers);
			            $http.post('PHP/nexo.php', { datos: {accion :"insertar",persona:$scope.persona}})
						  .then(function(respuesta) {     	
						 //aca se ejetuca si retorno sin errores      	
								 console.log(respuesta.data);
							

								},function errorCallback(response) {     		
						//aca se ejecuta cuando hay errores
								console.log( response);     			
				  });
						console.info("Ya guardé el archivo.", item, response, status, headers);
			        };




				  $scope.Guardar=function(){
					console.log($scope.SubirdorArchivos.queue);
					if($scope.SubirdorArchivos.queue[0]!=undefined)
					{
						var nombreFoto = $scope.SubirdorArchivos.queue[0]._file.name;
						$scope.persona.foto=nombreFoto;
					}
					$scope.SubirdorArchivos.uploadAll();
				  	console.log("persona a guardar:");
				    console.log($scope.persona);
					

				  

				  }
					


				$scope.Desloguear = function(){

					$auth.logout();
				}

				$scope.IraAlta = function(){
				$state.go("persona.Alta");
				}
				$scope.IraGrilla = function(){
					$state.go("persona.Grilla");
				}



});







miApp.controller("controlPersonaGrilla",function($scope,$state,$http,$auth){
			$scope.logeado = $auth.getPayload();
			
		 	$http.get('PHP/nexo.php', { params: {accion :"traer"}})
		 	.then(function(respuesta) {     	
		      	 $scope.ListadoPersonas = respuesta.data.listado;
		      	 

		    },function errorCallback(response) {
		     		 $scope.ListadoPersonas= [];
		     		console.log( response);

		     	});


		$scope.Desloguear = function(){

			$auth.logout();
			$state.go("login.menu");
		}

		$scope.IraAlta = function(){
		$state.go("persona.Alta");
		}
		$scope.IraGrilla = function(){
			$state.go("persona.Grilla");
		}


		 	
		 	$scope.Borrar=function(persona){
				console.log("borrar"+persona);



		$http.post("PHP/nexo.php",{datos:{accion :"borrar",persona:persona}},{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
		 .then(function(respuesta) {       
		         //aca se ejetuca si retorno sin errores        
		         console.log(respuesta.data);
				 $http.get('PHP/nexo.php', { params: {accion :"traer"}})
				.then(function(respuesta) {     	
					console.log(persona);
					 $scope.ListadoPersonas = respuesta.data.listado;
					 console.log(respuesta.data);

				},function errorCallback(response) {
						 $scope.ListadoPersonas= [];
						console.log( response);
				 });

		    },function errorCallback(response) {        
		        //aca se ejecuta cuando hay errores
		        console.log( response);           
		    });


		 	}


		$scope.Modificar=function(persona)
			{
				$state.go("modificacion", persona);
			};

});





miApp.controller("controlLogin",function($scope,$state,$auth,$http){

		$scope.usuario={};
		$scope.usuario.correo = "admin@admin";
		$scope.usuario.password = "admin";

		$scope.authenticate = function(provider) {
		      $auth.authenticate(provider);
		    };


		if($auth.isAuthenticated())
			console.info("Token",$auth.getPayload());
		else
			console.info("No Token",$auth.getPayload());

		$scope.IniciarSeccion = function(){
		$http.post("PHP/nexo.php",{datos:{accion :"validar",usuario:$scope.usuario}})
		 .then(function(respuesta) {       
		         //aca se ejetuca si retorno sin errores        
         	$scope.validador = respuesta.data;

         	console.info("d",$scope.validador);
			if($scope.validador != true)
			{
				console.log("no entro");
			}else
			{
								console.log("entro");
				 $http.post("PHP/nexo.php",{datos:{accion :"traer",usuario:$scope.usuario}})	
				 		 	.then(function(respuesta) {     	
							$datos = respuesta.data;
							$scope.usuario.tipo =$datos;
							console.info($scope.usuario);	
									
							$auth.login($scope.usuario)
				  			.then(function(response) {
				  				console.info(response);

				  			if($auth.isAuthenticated()){
				  				$state.go("persona.Grilla");
							
							console.info("Token Validado", $auth.getPayload());
							
						}
						else
							console.info("No Token Valido",$auth.getPayload());
    	
  	})
  	.catch(function(response) {
    	console.info("no",response);
  	});


		},function errorCallback(response) {
				 $scope.ListadoPersonas= [];
				console.log( response);
		 });
			
		}
	    	
  	});
  	
}

});




miApp.controller("ControlRegistro",function($scope,$state){


});

miApp.controller("controlSalaJuegos",function($scope,$state){
$scope.IraJuego1 = function(){
$state.go("sala.juego1");
}
$scope.IraJuego2 = function(){
$state.go("sala.juego2");
}
$scope.IraJuego3 = function(){
$state.go("sala.juego3");
}
$scope.IraJuego4 = function(){
$state.go("sala.juego4");
}
$scope.Comenzar =function(){
	console.log("holaaaa");
}






});


miApp.controller('controlModificacion', function($scope, $http, $state, $stateParams, FileUploader)//, $routeParams, $location)
{
	$scope.persona={};
	$scope.DatoTest="**Modificar**";
	$scope.SubirdorArchivos = new FileUploader({url:'./servidor/archivos.php'});  $scope.persona={};
	console.log($stateParams);//$scope.persona=$stateParams;
	$scope.persona.id=$stateParams.id;
	$scope.persona.nombre=$stateParams.nombre;
	$scope.persona.apellido=$stateParams.apellido;
	$scope.persona.dni=$stateParams.dni;
	$scope.persona.foto=$stateParams.foto;

	$scope.SubirdorArchivos.onSuccessItem=function(item, response, status, headers)
	{
		$http.post('PHP/nexo.php', { datos: {accion :"modificar",persona:$scope.persona}})
		.then(function(respuesta) 
		{
			//aca se ejetuca si retorno sin errores      	
			console.log(respuesta.data);
			$state.go("persona.Grilla");
		},
		function errorCallback(response)
		{
			//aca se ejecuta cuando hay errores
			console.log( response);     			
		});
		console.info("Ya guardé el archivo.", item, response, status, headers);
	};

	$scope.Modificar=function(persona)
	{
	
		if($scope.SubirdorArchivos.queue[0]!=undefined)
		{
			var nombreFoto = $scope.SubirdorArchivos.queue[0]._file.name;
			$scope.persona.foto=nombreFoto;
		}
		$scope.SubirdorArchivos.uploadAll();
	}

});