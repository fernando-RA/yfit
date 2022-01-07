enum Fixture {
    case trainerClass, trainerClassWithNoLocation, user, match

    var json: String {
        switch self {
        case .trainerClass:
            return trainerClass()

        case .trainerClassWithNoLocation:
            return trainerClass(location: "\"\"")

        case .user:
            return """
            {
                "slug" : "test-testtt",
                "stripe_customer_id" : "cus_1234",
                "workout_types" : [
                  {
                    "id" : 3,
                    "workout_type" : "Boxing"
                  },
                  {
                    "id" : 4,
                    "workout_type" : "Yoga"
                  },
                  {
                    "id" : 5,
                    "workout_type" : "HIIT"
                  },
                  {
                    "id" : 6,
                    "workout_type" : "Meditation"
                  }
                ],
                "last_name" : "testtt",
                "last_login" : "2021-06-15T11:35:04.315488Z",
                "bio" : "null",
                "fees" : true,
                "id" : 61,
                "email" : "testp@gmail.com",
                "phone_number" : null,
                "user_type" : "trainer",
                "profile_picture" : "https://undercard-18898-staging.s3.amazonaws.com/test.jpg",
                "referral_code" : "0",
                "geotag" : null,
                "photos" : [
                ],
                "hash" : "c29ecdd32ba20ea9",
                "first_name" : "test",
                "trainer_link" : "https://staging.getrec.com/test",
                "social_profile_url" : "https://lh3.googleusercontent.com/test",
                "instagram_link" : "https://www.instagram.com/test"
            }
            """

        case .match:
            return """
        {
              "id": 97,
              "created": "2021-06-16T10:18:48.691000Z",
              "user": 291,
              "owner": 301
            }
        """
        }
    }

    private func trainerClass(location: String = defaultLocation, tags: String = defaultTags) -> String {
        """
        {
          "featured_photo" : "https://undercard-18898-staging.s3.amazonaws.com/featured-photo-test.jpg",
          "location" : \(location),
          "slug" : "test-61",
          "class_link" : "https://staging.getrec.com/12341245/test",
          "link" : "",
          "tags" : \(tags),
          "duration" : 30,
          "location_notes" : "test",
          "is_attendee_limit" : true,
          "published_at" : "2021-06-15T10:54:27.810000Z",
          "end_repeat" : "2021-06-16T10:48:48.691000Z",
          "earned" : 0,
          "repeat" : "never",
          "name" : "test",
          "type" : "in_person",
          "cancellation_policy" : "flexible",
          "details" : "test details",
          "id" : 791,
          "safety_protocol" : "All equipment is sanitized before class.",
          "promo_code" : "",
          "suggested_locations" : null,
          "equipment" : "water",
          "attend_limit_count" : 10,
          "hash" : "ad14997618",
          "start_time" : "2021-06-16T10:18:48.691000Z",
          "free" : false,
          "created_at" : "2021-06-15T10:54:32.172263Z",
          "clients" : 0,
          "price" : "5.00",
          "geotag" : {
            "lat" : 54.091034625844379,
            "lng" : 28.309935829889692
          },
          "author" : \(Fixture.user.json),
          "canceled" : false,
        }
        """
    }

    private static var defaultLocation: String {
        """
        {
            "lat" : 40.712775299999997,
            "lng" : -74.005972799999995,
            "location_name" : "NYC, NY, USA"
        }
        """
    }

    private static var defaultTags: String {
        """
        ["Yoga", "Boxing", "some random tag that we didn't expect"]
        """
    }
}
