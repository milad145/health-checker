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
    error[2009] = {message: "نام کاربری و یا گذرواژه اشتباه است.", code: 403};
    error[2010] = {message: "نام کاربری حذف شده است.", code: 429};

    // signal > 3000
    error[3001] = {message: "آی دی کالیبریت معتبر نمی‌باشد!", code: 403};
    error[3002] = {message: "برای این آیدی هر ۳ مقدار فرستاده شده است.!", code: 403};
    error[3003] = {message: "این آی‌دی منقضی شده است!", code: 400};
    error[3004] = {message: "برای این آیدی هر ۳ مقدار کالیبریت فرستاده نشده است!", code: 400};
    error[3005] = {message: "انتقال این آیدی به صف کالیبریت با مشکل مواجه شده است!", code: 400};
    error[3006] = {message: "این آیدی هنوز در صف کالیبریت است!", code: 400};
    error[3007] = {message: "کالیبریت این آیدی با مشکل مواجه شده است. دوباره اقدام به کالیبریت کردن نمایید!", code: 400};
    error[3008] = {message: "کالیبریت برای این آیدی انجام شده است!", code: 400};
    error[3009] = {message: "انتقال این آیدی به صف estimate با مشکل مواجه شده است!", code: 400};
    error[3010] = {message: "مقادیر ارسالی از کالیبریت پایتون اشتباه است!", code: 400};
    error[3011] = {message: "مقادیر ارسالی calibrateStatus از کالیبریت پایتون اشتباه است!", code: 400};
    error[3012] = {message: "آی دی estimate معتبر نمی‌باشد!", code: 403};
    error[3013] = {message: "آی دی estimate و آی‌دی calibrate همخوانی ندارند!", code: 403};

    let response = error[code] || {};
    let err = new Error();
    err["responseCode"] = response.code || 500;
    err["message"] = response.message || "";
    err["messageCode"] = code || "";

    return err;
};
