User Management Dashboard

front-end solutions... VERSIONS === Angular 16.2.0, node 20.10.0
back-end solution FIREBASE

1. Firebase-ს ჩაშენებული არ აქვს role based controll, აქედან გამომდინარე ფრონტიდან ვწყვეტ იუზერი არის თუ არა ადმინი, თუ იმეილში @admin, ჩაწერთ დაარეგისტრირებს როგორც ადმინს, სხვა ნებისმიერ შემთხვევაში როგორც იუზერს.

2. Login page (email and password)  
   სატესტო დალოგინება email :::: admin@admin.com pass :::: admin1
   სატესტო დალოგინება email :::: user@user.com pass :::: useruser
3. Registration page (with basic info about user)
   იუზერის დარეგისტრირება/დალოგინება, ინფორმაციის შეყვანის შემთხვევაში იგზავნება რექუესთი firebase-ში და არეგისტრირებს ან ალოგინებს მომხმარებელს. დარეგისტრირების შემთხვევაში იუზერი ასევე ემატება მთავარ გვერდზე.

4. home component
   დალოგინების შემდეგ გადავდივართ home გვერდზე სადაც გვაქვს მომხმარებლების მონაცემები, თუ ვართ სისტემაში როგორც იუზერი გვაქვს წვდომა დეტალების გვერდზე, თუ ვართ ადმინის უფლებებით შესული, გვაქვს წვდომა მომხმარებლების დამატების, დაედიტების, დეტალების და წაშლის ღილაკებზე.

5. add user
   უფლება (admin)
   თუ თქვენ დაარეგისტრირებთ მომმარებელს მთავარი გვერდიდან(არა ავტორიზაციიდან) ის ავტომატურად დაემატება ავტორიზაციაშიც, ანუ მთავარი გვერდიდან დარეგისტრირების დროს ჩაწერილი მეილით და პაროლი. სისტემიდან რომ გამოხვიდეთ დალოგინებას შეძლებთ, როლი განისაზღვრება ზემოთ მოყვანილი 1) პუნქტის მიხედვით.

6. edit user
   უფლება (admin)
   თქვენ შეგიძლიათ დააფდეითოდ დინამიურად მომხმარებელი, რომელიც აისახება მომხმარებლის სიაში.
7. delete user
   უფლება (admin)
   თქვენ შეგიძლიათ წაშალოთ დინამიურად მომხმარებელი, რომელიც აისახება მომხმარებლის სიაში.
8. user details
   უფლება (admin/user)
   თქვენ შეგიძლიათ ნახოთ იუზერის სრული დეტალები.
