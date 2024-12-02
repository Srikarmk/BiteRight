        # Convert restaurant_id to int if stored as an integer in MongoDB
        try:
            restaurant_id = int(restaurant_id)
        except ValueError:
            raise HTTPException(status_code=400, detail="restaurant_id must be an integer")

        # Query the Analytics collection for the matching restaurant_id
        analytics_data = db["Analytics"].find_one(
            {"restaurant_id": restaurant_id},
            {"_id": 0, "Top_items": 1, "status_dist": 1}
        )

        if not analytics_data:
            raise HTTPException(
                status_code=404,
                detail=f"No analytics data found for restaurant_id: {restaurant_id}"
            )

        return {"success": True, "analytics": analytics_data}
    except Exception as e:
        print("Error in get_analytics:", str(e))
        raise HTTPException(
            status_code=500, 
            detail="An error occurred while fetching analytics data"
        )
