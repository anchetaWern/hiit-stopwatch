var Observable = require("FuseJS/Observable");
var Timer = require("FuseJS/Timer");
var GeoLocation = require("FuseJS/GeoLocation");

var time_elapsed = Observable();
var toggle_btn_text = Observable();
var is_running = Observable();
var laps = Observable();

toggle_btn_text.value = 'Start';
time_elapsed.value = "00:00:00";

var time = 0;
var lap_time = 0;
var locations = [];


function toggle() {

	if(toggle_btn_text.value == 'Start'){
		laps.clear();
		time_elapsed.value = formatTimer(time);
		is_running.value = true;

		locations.push(GeoLocation.location); // get initial location

		timer_id = Timer.create(function() {
			time += 1; // incremented every 10 milliseconds
			lap_time += 1;
			
			time_elapsed.value = formatTimer(time);
		}, 10, true);
	}else{
		Timer.delete(timer_id);
		time = 0;
		lap_time = 0;
		is_running.value = false;
	}

	toggle_btn_text.value = (toggle_btn_text.value == 'Start') ? 'Stop' : 'Start';
}


function formatTimer(time) {
	function pad(d) {
 		return (d < 10) ? '0' + d.toString() : d.toString();
 	}

	var millis = time * 10;
	var seconds = millis / 1000;

	mins = Math.floor(seconds / 60);
	secs = Math.floor(seconds) % 60,
 	hundredths = Math.floor((millis % 1000) / 10);
 	return pad(mins) + ":" + pad(secs) + ":" + pad(hundredths);
}


function addLap() {
	if(time > 0){

		lap_time_value = formatTimer(lap_time);
		lap_time = 0;

		var start_loc = locations[laps.length];
		var end_loc = GeoLocation.location;
		locations.push(end_loc);

		var distance = getDistanceFromLatLonInMeters(start_loc.latitude, start_loc.longitude, end_loc.latitude, end_loc.longitude);
			
		laps.insertAt(0, {
			title: ("Lap " + (laps.length + 1)),
			time: lap_time_value,
			distance: distance.toString() + " m."
		});
		
	}
}


function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
	function deg2rad(deg) {
	  return deg * (Math.PI/180)
	}

	var R = 6371; // radius of the earth in km
	var dLat = deg2rad(lat2 - lat1);  
	var dLon = deg2rad(lon2 - lon1); 
	var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2); 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
	var d = (R * c) * 1000; // distance in m
	return d;
}


module.exports = {
	toggle: toggle,
	toggle_btn_text: toggle_btn_text,
	is_running: is_running,
	time_elapsed: time_elapsed,
	laps: laps,
	addLap: addLap
}