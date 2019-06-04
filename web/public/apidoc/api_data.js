define({ "api": [  {    "type": "post",    "url": "/orders",    "title": "Create an order",    "name": "CreateOrder",    "group": "Orders",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String[]",            "optional": false,            "field": "origin",            "description": "<p>[&quot;START_LATITUDE&quot;, &quot;START_LONGTITUDE&quot;],</p>"          },          {            "group": "Parameter",            "type": "String[]",            "optional": false,            "field": "destination",            "description": "<p>[&quot;END_LATITUDE&quot;, &quot;END_LONGTITUDE&quot;]</p>"          }        ]      }    },    "success": {      "fields": {        "200": [          {            "group": "200",            "type": "Number",            "optional": false,            "field": "id",            "description": "<p>&lt;order_id&gt;, (auto-incremental integer or UUID)</p>"          },          {            "group": "200",            "type": "Number",            "optional": false,            "field": "distance",            "description": "<p>&lt;total_distance&gt;,(integer in meters)</p>"          },          {            "group": "200",            "type": "String",            "optional": false,            "field": "status",            "description": "<p>e.g. 'UNASSIGNED'</p>"          }        ]      }    },    "error": {      "fields": {        "Error 4xx": [          {            "group": "Error 4xx",            "type": "String",            "optional": false,            "field": "error",            "description": "<p>e.g. &quot;ERROR_DESCRIPTION&quot;</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "./routes/orders/createOrder.js",    "groupTitle": "Orders"  },  {    "type": "get",    "url": "/orders",    "title": "Get order list",    "name": "Get_Order_list",    "group": "Orders",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "Object[]",            "optional": false,            "field": "data",            "description": ""          },          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "data.id",            "description": "<p>order_id</p>"          },          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "data.distance",            "description": "<p>distance</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "data.status",            "description": "<p>status e.g. &quot;TAKEN&quot;</p>"          }        ]      }    },    "error": {      "fields": {        "Error 4xx": [          {            "group": "Error 4xx",            "type": "String",            "optional": false,            "field": "error",            "description": "<p>e.g. &quot;ERROR_DESCRIPTION&quot;</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "./routes/orders/list.js",    "groupTitle": "Orders"  },  {    "type": "patch",    "url": "/orders/:id",    "title": "Take an order",    "name": "Take_Order",    "group": "Orders",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "id",            "description": "<p>&lt;order_id&gt;, (auto-incremental integer or UUID)</p>"          }        ]      }    },    "success": {      "fields": {        "200": [          {            "group": "200",            "type": "String",            "optional": false,            "field": "status",            "description": "<p>e.g. &quot;TAKEN&quot; or &quot;SUCCESS&quot;</p>"          }        ]      }    },    "error": {      "fields": {        "Error 4xx": [          {            "group": "Error 4xx",            "type": "String",            "optional": false,            "field": "error",            "description": "<p>e.g. &quot;ERROR_DESCRIPTION&quot;</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "./routes/orders/takeOrder.js",    "groupTitle": "Orders"  }] });
