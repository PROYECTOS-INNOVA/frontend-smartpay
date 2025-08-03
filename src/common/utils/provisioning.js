export const generateProvisioningJson = (enrolmentId, storeId, reEnrollment) => ({
    "android.app.extra.PROVISIONING_DEVICE_ADMIN_COMPONENT_NAME": "com.olimpo.smartpay/com.olimpo.smartpay.receivers.SmartPayDeviceAdminReceiver",
    "android.app.extra.PROVISIONING_DEVICE_ADMIN_SIGNATURE_CHECKSUM": "kJRMvpwEEQAuduFc-ics0DAZXaemiRUv3U298wZo2Go=",
    "android.app.extra.PROVISIONING_DEVICE_ADMIN_PACKAGE_DOWNLOAD_LOCATION": "https://appincdevs.com/enterprise/smartpay-google.apk",
    "android.app.extra.PROVISIONING_DEVICE_ADMIN_PACKAGE_CHECKSUM": "kJRMvpwEEQAuduFc-ics0DAZXaemiRUv3U298wZo2Go=",
    "android.app.extra.PROVISIONING_LEAVE_ALL_SYSTEM_APPS_ENABLED": true,
    "android.app.extra.PROVISIONING_LOCALE": "es_ES",
    "android.app.extra.PROVISIONING_ADMIN_EXTRAS_BUNDLE": {
      "ENROLLMENT_ID": enrolmentId,
      "STORE_ID": storeId,
      "RE_ENROLLMENT": reEnrollment
    }
});