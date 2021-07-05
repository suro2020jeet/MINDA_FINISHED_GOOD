sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/export/Spreadsheet",
	"sap/m/MessageToast",
	"sap/ui/unified/FileUploaderParameter"
], function (Controller, JSONModel, Spreadsheet, MessageToast, FileUploaderParameter) {
	"use strict";

	return Controller.extend("com.minda.FinishedGood.controller.finishedGood", {

		onInit: function () {
			// this.getOwnerComponent().getModel().setHeaders({
			// 	X_CSRF_Token: "Fetch"
			// });
			var date = new Date();
			var tomorrow = new Date(date);
			tomorrow.setDate(tomorrow.getDate() + 1);
			this.getView().setModel(new JSONModel({
				currentDate: date.toDateString(),
				nextDate: tomorrow.toDateString()
			}), "viewModel");
		},
		onPressDownload: function(){
			sap.m.URLHelper.redirect("/sap/opu/odata/sap/ZINV_CAP_DEC_SRV/DownloadSet(lifnr='200005')/$value");
		},
		onSubmitPress: function (oEvent) {
			var oFileUploader = this.byId("fileUploader");
			oFileUploader.removeAllHeaderParameters();
			this.getOwnerComponent().getModel().refreshSecurityToken();
			var csrfToken = this.getOwnerComponent().getModel().getHeaders()["x-csrf-token"];
			oFileUploader.insertHeaderParameter(new FileUploaderParameter({
				name: "x-csrf-token",
				value: csrfToken
			}));
			// var oHeaderParameter = new sap.ui.unified.FileUploaderParameter({
			// 	name: "slug",
			// 	value: ""
			// });
			// oFileUploader.insertHeaderParameter(oHeaderParameter);
			oFileUploader.upload();

		},
		handleUploadComplete: function (oEvent) {
			var sResponse = oEvent.getParameter("response");
			oEvent.getSource().setValue("");
			if (oEvent.mParameters.status == 201) {
				var parser = new DOMParser();
				var xml = parser.parseFromString(oEvent.mParameters.responseRaw, "application/xml");
				var message = xml.getElementsByTagName("m:properties")[0].getElementsByTagName("d:Mesg")[0].textContent;
				sap.m.MessageBox.success(message);
			} else {
				var parser = new DOMParser();
				var xml = parser.parseFromString(oEvent.mParameters.responseRaw, "application/xml");
				sap.m.MessageBox.error(xml.getElementsByTagName("message")[0].innerHTML);
			}
		},

	});

});