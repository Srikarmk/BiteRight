    for consequent, confidence in zip(doc["consequent"], doc["confidence"]):
            if confidence > 0.5:
                consequents.append(consequent)
                
        # Break if we have at least 3 consequents
        if len(consequents) >= 3:
            break

    if not consequents:
        raise HTTPException(status_code=404, detail="No matching consequents found.")
    print(consequents[:3])
    return {"consequents": consequents[:3]}  # Return up to 3 consequents