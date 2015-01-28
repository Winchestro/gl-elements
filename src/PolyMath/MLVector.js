void function MLVector ( ) {

	function Vector ( ) {
		this.length = 0;
		[].push.apply( this,arguments );
		Object.defineProperty( this, "length", { value : arguments.length } );
	}

	Vector.prototype = Object.create ( { }, {
		splice : {
			value : [].splice
		},
		len : {
			get : function ( ) {
				return Math.sqrt( this.lenSq );
			},
			set : function ( n ) {
				var L = this.len;
				if( L === 0 ) return;
				this.multScalar( n / L );
			}
		},
		lenSq : {
			get : function ( ) {
				return [].reduce.call( this, function ( p, c ) { 
					return p += c * c
				}, 0 );
			}
		},
		lenMan : {
			get : function ( ) {
				return [].reduce.call( this, function ( p, c ) {
					return p += Math.abs( c );
				}, 0 );
			}
		},
		add : {
			value : function ( vec ) {
				for ( var i in vec ) this[i] += vec[i];
				return this;
			}
		},
		sub : {
			value : function ( vec ) {
				for ( var i in vec ) this[i] -= vec[i];
				return this;
			}
		},
		mult : {
			value : function ( vec ) {
				for ( var i in vec ) this[i] *= vec[i];
				return this;
			}
		},
		multScalar : {
			value : function ( scalar ) {
				for ( var i in this ) this[i] *= scalar;
				return this;
			}
		},
		lerp : {
			value : function ( vec, alpha ) {
				for ( var i in this ) this[i] += (vec[i] - this[i]) * alpha;
				return this;
			}
		},
		dot : {
			value : function ( vec ) {
				return [].reduce.call( this, function ( p, c, i ) {
					return p += c * vec[i];
				}, 0 );
			}
		},
		norm : {
			value : function ( ) {
				var L = this.len;
				if( L === 0 ) return this;
				else this.multScalar( 1 / L );
				return this;
			}
		}
	} );

	Vector.copy = function ( array ) {
		
		for ( var p in this ) this[p] = array[p];
	};


	function vec2 ( x, y ) {
		if( !( this instanceof vec2 ) ) return new vec2 ( x, y );
		Object.defineProperty ( this, "length", { value : 2 } );
		this.x = x || 0;
		this.y = y || 0;
	}

	vec2.prototype = Object.create ( Vector.prototype, {
		add : {
			value : function ( vecA, vecB ) {
				vecB = vecB || this;
				this[0] = vecA[0] + vecB[0];
				this[1] = vecA[1] + vecB[1];
				return this;
			}
		},
		sub : {
			value : function ( vecA, vecB ) {
				vecB = vecB || this;
				this[0] = vecA[0] - vecB[0];
				this[1] = vecA[1] - vecB[1];
				return this;
			}
		},
		mult : {
			value : function ( vecA, vecB ) {
				vecB = vecB || this;
				this[0] = vecA[0] * vecB[0];
				this[1] = vecA[1] * vecB[1];
				return this;
			}
		},
		copy : {
			value : function ( vec ) {
				this.x = vec[0];
				this.y = vec[1];
				return this;
			}
		}
	} );

	vec2.copy = function ( array ) {
		return new vec2 (
			array[0],
			array[1]
		);
	};
	vec2.add = function ( vecA, vecB ) {
		return new vec2 (
			vecA[0] + vecB[0],
			vecA[1] + vecB[1]
		);
	};
	vec2.sub = function (vecA, vecB ) {
		return new vec2 (
			vecA[0] - vecB[0],
			vecA[1] - vecB[1]
		);
	};
	vec2.mult = function ( vecA, vecB ) {
		return new vec2 (
			vecA[0] * vecB[0],
			vecA[1] * vecB[1]
		);
	};
	vec2.dot = function (vecA, vecB ) {
		
		return vecA[0] * vecB[0] + vecA[1] * vecB[1];
	};

	function vec3 ( x, y, z ) {
		if( !( this instanceof vec3 ) ) return new vec3 ( x, y, z );
		Object.defineProperty( this, "length", { value : 3 } );
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
	}

	vec3.prototype = Object.create( Vector.prototype, {
		add : {
			value : function ( vecA, vecB ) {
				vecB = vecB || this;
				this.x = vecA[0] + vecB[0];
				this.y = vecA[1] + vecB[1];
				this.z = vecA[2] + vecB[2];
				return this;
			}
		},
		sub : {
			value : function ( vecA, vecB ) {
				vecB = vecB || this;
				this.x = vecA[0] - vecB[0];
				this.y = vecA[1] - vecB[1];
				this.z = vecA[2] - vecB[2];
				return this;
			}
		},
		mult : {
			value : function ( vecA, vecB ) {
				vecB = vecB || this;
				this.x = vecA[0] * vecB[0];
				this.y = vecA[1] * vecB[1];
				this.z = vecA[2] * vecB[2];
				return this;
			}
		},
		cross : {
			value : function ( vecA, vecB ) {
				vecB = vecB || vec3.copy( this );
				this.x = vecA[1] * vecB[2] - vecA[2] * vecB[1];
				this.y = vecA[2] * vecB[0] - vecA[0] * vecB[2];
				this.z = vecA[0] * vecB[1] - vecA[1] * vecB[0];
				return this;
			}
		},
		applyQuat4 : {
			value : function ( quat ) {
				var x = quat[3] * this[0] + quat[1] * this[2] - quat[2] * this[1];
				var y = quat[3] * this[1] + quat[2] * this[0] - quat[0] * this[2];
				var z = quat[3] * this[2] + quat[0] * this[1] - quat[1] * this[0];
				var w = quat[0] * this[0] - quat[1] * this[1] - quat[2] * this[2];

				this.x = x * quat[3] + w * -quat[0] + y * -quat[2] - z * -quat[1];
				this.y = y * quat[3] + w * -quat[1] + z * -quat[0] - x * -quat[2];
				this.z = z * quat[3] + w * -quat[2] + x * -quat[1] - y * -quat[0];
				
				return this;

			}
		},
		copy : {
			value : function ( vec ) {
				this.x = vec[0];
				this.y = vec[1];
				this.z = vec[2];
				return this;
			}
		}
	});

	vec3.copy = function ( array ) {
		return new vec3 (
			array[0],
			array[1],
			array[2]
		);
	};
	vec3.add = function ( vecA, vecB ) {
		return new vec3 (
			vecA[0] + vecB[0],
			vecA[1] + vecB[1],
			vecA[2] + vecB[2]
		);
	};
	vec3.sub = function ( vecA, vecB ) {
		return new vec3 (
			vecA[0] - vecB[0],
			vecA[1] - vecB[1],
			vecA[2] - vecB[2]
		);
	};
	vec3.mult = function ( vecA, vecB ) {
		return new vec3 (
			vecA[0] * vecB[0],
			vecA[1] * vecB[1],
			vecA[2] * vecB[2]
		);
	};
	vec3.cross = function ( vecA, vecB ) {
		return new vec3 (
			vecA[1] * vecB[2] - vecA[2] * vecB[1],
			vecA[2] * vecB[0] - vecA[0] * vecB[2],
			vecA[0] * vecB[1] - vecA[1] * vecB[0]
		);
	};
	vec2.dot = function ( vecA, vecB ) {
		
		return vecA[0] * vecB[0] + vecA[1] * vecB[1] + vecA[2] * vecB[2];
	};


	function vec4 ( x, y, z, w ) {
		if( !( this instanceof vec4 ) ) return new vec4 ( x, y, z, w );
		Object.defineProperty ( this, "length", { value : 4 } );
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
		this.w = w || 0;
	}

	vec4.prototype = Object.create( Vector.prototype, {
		add : {
			value : function ( vecA, vecB ) {
				vecB = vecB || this;
				this.x = vecA[0] + vecB[0];
				this.y = vecA[1] + vecB[1];
				this.z = vecA[2] + vecB[2];
				this.w = vecA[3] + vecB[3];
				return this;
			}
		},
		sub : {
			value : function ( vecA, vecB ) {
				vecB = vecB || this;
				this.x = vecA[0] - vecB[0];
				this.y = vecA[1] - vecB[1];
				this.z = vecA[2] - vecB[2];
				this.w = vecA[3] - vecB[3];
				return this;
			}
		},
		mult : {
			value : function ( vecA, vecB ) {
				vecB = vecB || this;
				this.x = vecA[0] * vecB[0];
				this.y = vecA[1] * vecB[1];
				this.z = vecA[2] * vecB[2];
				this.w = vecA[3] * vecB[3];
				return this;
			}
		},
		copy : {
			value : function ( vec ) {
				this.x = vec[0];
				this.y = vec[1];
				this.z = vec[2];
				this.w = vec[3];
				return this;
			}
		}
	} );

	vec4.copy = function ( array ) {
		return new vec4 (
			array[0],
			array[1],
			array[2],
			array[3]
		);
	};
	vec4.add = function ( vecA, vecB ) {
		return new vec4 (
			vecA[0] + vecB[0],
			vecA[1] + vecB[1],
			vecA[2] + vecB[2],
			vecA[3] + vecB[3]
		);
	};
	vec4.sub = function ( vecA, vecB ) {
		return new vec4 (
			vecA[0] - vecB[0],
			vecA[1] - vecB[1],
			vecA[2] - vecB[2],
			vecA[3] - vecB[3]
		);
	};
	vec4.mult = function ( vecA, vecB ) {
		return new vec4 (
			vecA[0] * vecB[0],
			vecA[1] * vecB[1],
			vecA[2] * vecB[2],
			vecA[3] * vecB[3]
		);
	};
	vec4.dot = function ( vecA, vecB ) {
		
		return vecA[0] * vecB[0] + vecA[1] * vecB[1] + vecA[2] * vecB[2] + vecA[3] * vecB[3];
	};


	function quat4 ( x, y, z, w ) {
		if( !( this instanceof quat4 ) ) return new quat4( x, y, z, w );
		Object.defineProperty ( this, "length", { value : 4 } );
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
		this.w = ( w === undefined ) ? 1 : w;
	}

	quat4.prototype = Object.create( Vector.prototype, {
		mult : {
			value : function ( qA, qB ) {
				qB = qB || new quat4.copy( this );
				this.x = qB[0] * qA[3] + qB[3] * qA[0] + qB[1] * qA[2] - qB[2] * qA[1];
				this.y = qB[1] * qA[3] + qB[3] * qA[1] + qB[2] * qA[0] - qB[0] * qA[2];
				this.z = qB[2] * qA[3] + qB[3] * qA[2] + qB[0] * qA[1] - qB[1] * qA[0];
				this.w = qB[3] * qA[3] - qB[3] * qA[0] - qB[1] * qA[1] - qB[2] * qA[2];
				return this;
			}
		},
		norm : {
			value : function ( ) {
				var L = this.len;
				if( L === 0 ) {
					this.x = 0;
					this.y = 0; 
					this.z = 0; 
					this.w = 1;
				}
				else this.multScalar( 1 / L );

				return this;
			}
		},
		conjugate : {
			value : function ( ) {
				this.x *= -1;
				this.y *= -1;
				this.z *= -1;
				return this;
			}
		},
		axisAngle : {
			value : function ( axis, angle ) {
				var s = Math.sin( angle * .5 );
				this.x = axis[0] * s;
				this.y = axis[1] * s;
				this.z = axis[2] * s;
				this.w = Math.cos( angle * .5 );
				return this;
			}
		}
	});

	quat4.copy = function ( array ) {
		return new quat4(
			array[0],
			array[1],
			array[2],
			array[3]
		);
	};
	quat4.axisAngle = function ( axis, angle ) {
		var s = Math.sin( angle * .5 );
		return new quat4(
			axis[0] * s,
			axis[1] * s,
			axis[2] * s,
			Math.cos( angle * .5 )
		);
	};
	quat4.mult = function ( qA, qB ) {
		qB = qB || new quat4.copy( this );
		return new quat4(
			qB[0] * qA[3] + qB[3] * qA[0] + qB[1] * qA[2] - qB[2] * qA[1],
			qB[1] * qA[3] + qB[3] * qA[1] + qB[2] * qA[0] - qB[0] * qA[2],
			qB[2] * qA[3] + qB[3] * qA[2] + qB[0] * qA[1] - qB[1] * qA[0],
			qB[3] * qA[3] - qB[3] * qA[0] - qB[1] * qA[1] - qB[2] * qA[2]
		);	
	};

	[ "x", "y", "z", "w" ].map( function ( ex, x, a ) {
		var getter = "return this["+x+"];";
		var setter = "this["+x+"] = v;";
		if ( x < 2 ) $( vec2, a[x], getter, setter );
		if ( x < 3 ) $( vec3, a[x], getter, setter );
		$( vec4, a[x], getter, setter );
		$( quat4, a[x], getter, setter );
		/* 	swizzle is super expensive to set up until ES6 Proxies -> 
			7ms to define one property (ok)
			200-1000ms to define all combinations. (unaccaptable)
			with Proxies this won't be a problem any more

		return a.map(function(ey,y){
			var getter = "return new this.vec2(this["+x+"],this["+y+"]);";
			var setter = "this["+x+"]=v[0];this["+y+"]=v[1];";
			if(x<2&&y<2)$(vec2,a[x]+a[y],getter,setter);
			if(x<3&&y<3)$(vec3,a[x]+a[y],getter,setter);
			$(vec4,a[x]+a[y],getter,setter);        
			return a.map(function(ez,z){
				var getter = "return new this.vec3(this["+x+"],this["+y+"],this["+z+"]);";
				var setter = "this["+x+"]=v[0];this["+y+"]=v[1];this["+z+"]=v[2];";
				if(x<2&&y<2&&z<2)$(vec2,a[x]+a[y]+a[z],getter,setter);
				if(x<3&&y<3&&z<3)$(vec3,a[x]+a[y]+a[z],getter,setter);
				$(vec4,a[x]+a[y]+a[z],getter,setter);
				return a.map(function(ew,w){
					var getter = "return new this.vec4(this["+x+"],this["+y+"],this["+z+"],this["+w+"]);";
					var setter = "this["+x+"]=v[0];this["+y+"]=v[1];this["+z+"]=v[2];this["+w+"]=v[3];";
					if(x<2&&y<2&&z<2&&w<2)$(vec2,a[x]+a[y]+a[z]+a[w],getter,setter);
					if(x<3&&y<3&&z<3&&w<3)$(vec3,a[x]+a[y]+a[z]+a[w],getter,setter);
					$(vec4,a[x]+a[y]+a[z]+a[w],getter,setter);
				})
			})
		})
		*/
		function $( constructor, property, getter, setter ) {
			Object.defineProperty( constructor.prototype, property, {
				get : new Function( getter ),
				set : new Function( "v",setter )
			} );
		}
	} );
	
	
	const EXPORT = {
		Vector : Vector,
		vec2 : vec2,
		vec3 : vec3,
		vec4 : vec4,
		quat4 : quat4
	};
	for ( var e in EXPORT ) window[e] = math[e] = EXPORT[e];
} ( );
