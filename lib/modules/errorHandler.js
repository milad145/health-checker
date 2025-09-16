export const errorCode = (code) => {
    let error = {};

    // default
    error[400] = {message: "مقادیر ارسالی اشتباه است.", code: 400};
    error[401] = {message: "برای دسترسی به این اطلاعات ابتدا وارد حساب کاربری خود شوید.", code: 401};
    error[403] = {message: "عدم دسترسی", code: 403};
    error[404] = {message: "یافت نشد", code: 404};
    error[410] = {message: "لینک منقضی شده. دوباره qrCode را اسکن کنید.", code: 410};

    // user > 2000
    error[2001] = {message: "کاربر قبلا ثبت شده است!", code: 409};
    error[2002] = {message: "کابر هنوز ثبت نام نکرده!", code: 404};
    error[2003] = {message: "کد تایید ارسالی اشتباه است.", code: 403};
    error[2004] = {
        message: "به دلیل تعداد بالای کدهای غلط، کد محرمانه منقضی شد پس از چند دقیقه دوباره کد جدیدی دریافت کنید.",
        code: 403
    };
    error[2005] = {
        message: "کد وارد شده به دلیل گذشت زمان منقضی شده است. لطفا کد جدیدی درخواست نمایید.",
        code: 403
    };

    // signal > 3000
    error[3001] = {message: "آی دی کالیبریت معتبر نمی‌باشد!", code: 403};
    error[3002] = {message: "برای این آیدی هر ۳ مقدار فرستاده شده است.!", code: 403};
    error[3003] = {message: "این آی‌دی منقضی شده است!", code: 400};
    error[3004] = {message: "برای این آیدی هر ۳ مقدار کالیبریت فرستاده نشده است!", code: 400};
    error[3005] = {message: "انتقال این آیدی به صف کالیبریت با مشکل مواجه شده است!", code: 400};
    error[3006] = {message: "این آیدی هنوز در صف کالیبریت است!", code: 202};
    error[3007] = {message: "کالیبریت این آیدی با مشکل مواجه شده است. دوباره اقدام به کالیبریت کردن نمایید!", code: 400};
    error[3008] = {message: "کالیبریت برای این آیدی انجام شده است!", code: 400};
    error[3009] = {message: "انتقال این آیدی به صف estimate با مشکل مواجه شده است!", code: 400};
    error[3010] = {message: "مقادیر ارسالی از کالیبریت پایتون اشتباه است!", code: 400};
    error[3011] = {message: "مقادیر ارسالی calibrateStatus از کالیبریت پایتون اشتباه است!", code: 400};
    error[3012] = {message: "آی دی estimate معتبر نمی‌باشد!", code: 403};
    error[3013] = {message: "آی دی estimate و آی‌دی calibrate همخوانی ندارند!", code: 403};
    error[3014] = {message: "پردازش estimate هنوز به پایان نرسیده است!", code: 202};
    error[3015] = {message: "پردازش estimate با خطا مواجه شده است!", code: 422};

    let response = error[code] || {};
    let err = new Error();
    err["responseCode"] = response.code || 500;
    err["message"] = response.message || "";
    err["messageCode"] = code || "";

    return err;
};
